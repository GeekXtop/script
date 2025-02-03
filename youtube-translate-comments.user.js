// ==UserScript==
// @name         YouTube自动翻译评论
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动点击YouTube评论区翻译按钮
// @author       GeekXtop
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  // 配置参数
  const config = {
    targetButtonClass: 'ytd-tri-state-button-view-model', // 目标按钮class
    translationText: '翻译成中文（中国）', // 按钮识别文本
    debounceTime: 200, // 防抖时间
  }

  let timeoutId = null

  // 精确查找翻译按钮
  function findTranslateButton() {
    return Array.from(document.querySelectorAll(config.targetButtonClass)).find(
      (button) => {
        const buttonText = button.textContent.trim()
        return buttonText && buttonText.includes(config.translationText)
      }
    )
  }

  // 执行点击操作（带防抖）
  function clickTranslateButton() {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      const button = findTranslateButton()
      if (button && button.offsetParent !== null) {
        // 确保按钮可见
        console.log('找到翻译按钮，执行点击')
        button.click()
      }
    }, config.debounceTime)
  }

  // 创建观察器监测评论区变化
  function createObserver() {
    const commentsSection = document.querySelector('ytd-comments')
    if (!commentsSection) return null

    const observer = new MutationObserver((mutations) => {
      // 检测到评论容器变化时触发
      clickTranslateButton()
    })

    // 精准观察评论区的变化
    observer.observe(commentsSection, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    // 添加滚动事件监听（带节流）
    let isScrolling
    window.addEventListener(
      'scroll',
      () => {
        clearTimeout(isScrolling)
        isScrolling = setTimeout(() => {
          clickTranslateButton()
        }, 300)
      },
      { passive: true }
    )

    return observer
  }

  // 初始化逻辑
  function init() {
    let observer = createObserver()

    // 页面跳转时重新绑定观察器
    window.addEventListener('yt-navigate-finish', () => {
      observer.disconnect()
      observer = createObserver()
      clickTranslateButton()
    })

    // 初始执行
    clickTranslateButton()
  }

  // 等待页面加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
