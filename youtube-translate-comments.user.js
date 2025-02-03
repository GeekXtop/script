// ==UserScript==
// @name         YouTube Auto Expand & Translate Comments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动展开并翻译YouTube评论区回复
// @author       Cline
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  // 自动点击"展开"按钮
  const clickExpandButtons = () => {
    // 精确匹配包含"展开"文本的按钮
    document
      .querySelectorAll('tp-yt-paper-button span.more-button')
      .forEach((btn) => {
        const button = btn.closest('tp-yt-paper-button')
        if (button && btn.textContent.trim() === '展开') {
          button.click()
          console.log('已展开评论')
        }
      })
  }

  // 自动点击翻译按钮（适配新版YouTube界面）
  const clickTranslateButtons = () => {
    document
      .querySelectorAll(
        'ytd-tri-state-button-view-model.translate-button.style-scope.ytd-comment-view-model'
      )
      .forEach((btn) => {
        const button = btn.querySelector('tp-yt-paper-button')
        if (button && button.textContent.includes('翻译成中文（中国）')) {
          button.click()
          console.log('已触发翻译')
          // 添加防抖处理避免重复点击
          button.style.pointerEvents = 'none'
          setTimeout(() => (button.style.pointerEvents = 'auto'), 3000)
        }
      })
  }

  // 主执行函数
  const main = () => {
    setTimeout(clickExpandButtons, 2000)
    setTimeout(clickTranslateButtons, 3000)
  }

  // 监听DOM变化以处理动态加载的评论
  const observer = new MutationObserver(main)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // 初始执行
  main()
})()
