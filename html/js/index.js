// 定义一个全局组件，支持 props
// Vue.component('my-component', {
//   // 定义组件接受的 props
//   props: ['title'],
//   // 组件模板
//   template: `
//           <div>
//             <h2>{{ title }}</h2>
//             <h2>{{ msg }}</h2>
//             <p>这个组件接收一个 "title" 属性。</p>

//           </div>
//         `,
//   data() {
//     return {
//       msg: 'Hello Vue!'
//     }
//   }
// });



new Vue({
  el: '#app',
  data() {
    return {
      tabActive: 0,
      tabList: [
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" style="display: block;"><path fill="currentColor" d="M6 20q-1.65 0-2.825-1.175T2 16V8q0-1.65 1.175-2.825T6 4h12q1.65 0 2.825 1.175T22 8v8q0 1.65-1.175 2.825T18 20zM6 8h12q.55 0 1.05.125t.95.4V8q0-.825-.587-1.412T18 6H6q-.825 0-1.412.588T4 8v.525q.45-.275.95-.4T6 8m-1.85 3.25l11.125 2.7q.225.05.45 0t.425-.2l3.475-2.9q-.275-.375-.7-.612T18 10H6q-.65 0-1.137.338t-.713.912" /></svg>`,
          text: '钱包',
          url: './index.html'
        }, {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48" style="display: block;"><circle cx="34.965" cy="36.208" r="4.235" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" /><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m26.043 23.026l.718.685l-15.325 18.001L7.78 38.45l15.467-17.751l.848.783l7.397-8.44l-.566-.48c-.847-2.31-2.096-4.563-5.743-6.134c4.38-.6 7.225.804 9.528 2.915l.653-.74l1.87 1.61l-.565.827l1.044.783c-.383 2.044 1.84 1.99 2.091 2.089l2.695 2.654l-3.045 3.567l-3.046-2.436c-.254-.778-.393-1.872-2.262-2.22l-.87-.739zm-.281 1.859l7.636 7.389M23.314 27.76l7.56 7.354M8.25 9.232l4.23 2.322l-2.814 5.076L5.5 14.366c5.978 13.025 17.985-7.471 2.75-5.134m6.95 5.833l7.2 6.607m-2.533 2.906l-7.089-6.568" /></svg>`,
          text: '工具',
          url: './index.html'
        }],
      wallets: [
        {
          remark: '测试钱包',
          // 0: 导入  1: 创建  2: 冷钱包 3: 观察钱包
          type: 0,
          privateKey: '0x1234567890',
          // address: [
          //   {
          //     chainType: 'ETH',
          //     address: '0x1234567890',
          //   },
          //   {
          //     chainName: 'BTC',
          //     address: '0x1234567890',
          //   }
          // ]
        }
      ],
      walletListShow: false,
      chainList: [
        {
          chainType: 'ETH',
          chainName: '以太坊',
          chainIcon: 'https://cdn.jsdelivr.net/gh/ethereum/brand-assets/src/logos/ethereum-logo.svg',
          chainUrl: ['https://www.ethereum.org/'],
          chainAddress: 'https://etherscan.io/',
          chainExplorer: 'https://etherscan.io/',
          chainToken: [
            {
              tokenName: 'ETH',
              tokenIcon: 'https://cdn.jsdelivr.net/gh/ethereum/brand-assets/src/logos/ethereum-logo.svg',
              tokenAddress: '0x',
              tokenExplorer: 'https://etherscan.io/',
            }
          ]
        }
      ],
      chainListShow: false,
    }
  },
  methods: {
    ojbk() {
      console.log(123);
      this.show = true
    }
  }
})