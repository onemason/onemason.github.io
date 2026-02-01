---
title: Vue应用是如何形成的
date: 2019-4-5
---

文/年容

先扯淡。

最近在果壳网看到[<span>一篇文章</span>](https://www.guokr.com/article/445991/)解释了一个问题：为什么不管是坐在写字楼的办公位敲打键盘还是行走于施工一线挥汗如雨都会让人觉得劳累。我总结了一下原因：从被动的努力中获取不到满足感使人疲惫。解释一下就是内心是想刷微博刷朋友圈追剧搓麻打牌的，但是又因为生活所迫不得不"努力"地搬砖维持生计从而导致疲劳。换句话说那些发自内心喜欢自己工作的人从来不会感到疲倦。能从工作中真正获得满足感和自由的人100个里头也许只有一个吧。

闲扯结束，来聊点伪技术。

不知道你们觉得Vue里头最简洁的一个函数是什么？先来看几行代码。

```javascript
import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App),
}).$mount('#app')
```

应该不陌生，通过使用Vue CLI构建出一个最简单的项目，在项目的src目录下的main.js文件里能找到这几行代码。以上几行代码的作用是渲染传递给h函数的根组件即App后挂载到DOM节点树上。为了方便，我做了一个简单的目录树（去除了一些与本主题无关的目录或文件）。

```scss
vue-demo
├── public
│   └── index.html
└── src
    ├── App.vue
    ├── components
    │   └── HelloWorld.vue
    └── main.js
```

作为一个新手，以我狭隘的视野去看，render函数的简洁着实让我感到惊讶。render是一个函数，给render传进去的参数h也是一个函数,h函数接收的参数是App。这行代码很简短却做了好多事情。所以我之前提到的最简洁的函数指的也就是它了。有个一开始让我很摸不着头脑的问题是为啥取了个h这么无厘头名称做参数名。google一番后在[<span>这篇文章<span>](https://css-tricks.com/what-does-the-h-stand-for-in-vues-render-method/)里找到了答案。大致意思是h是hyperscritpt的缩写，把h(App)理解为一个动词就是使得App成为DOM, 准确的说h(App)返回的应该是一个虚拟DOM。至于虚拟DOM这种东西是什么就不讲了，因为我也不知道。来看我从VueMastery官网课程中截取的一张图。![Vue应用是如何形成的](Vue%E5%BA%94%E7%94%A8%E6%98%AF%E5%A6%82%E4%BD%95%E5%BD%A2%E6%88%90%E7%9A%84/vue-application-diagram.svg)

main.js右边的类似于盒子的东西就是就是render函数了，暂时取个比较俗的名字管它叫渲染器吧。所有子组件，比如HelloWorld等组件的归属最终都是App，所以只要把App传递进渲染器中就能渲染整个Vue应用了。大致的流程就是先将App这个根组件放到渲染器中进行渲染，渲染完成后会把渲染结果通过$mount()函数挂载到index.html文件中id为app的div下，这样整个应用就形成了。

这就是一个励志于成为一个偏后端的临栈Java工程师的第一篇伪技术博文了。如有错误，请无情的批评指正。下一篇准备写下Docker。基本月更，别太惦记。

