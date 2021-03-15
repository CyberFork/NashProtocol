<template>
  <div id="index" style="width: 50%; margin: auto; min-width: 22rem">
    <!-- <header> -->
    <div class="card" style="background-color: rgba(255, 0, 255, 0.2)">
      <div class="card-body">
        <span>
          <span class="neon" onclick="location.reload();"> <img src="../assets/nash.png" />N✌A✊S✋H - #0</span>
        </span>
        <span style="float: right">
          <div v-if="ethereumC == false" style="background-color: rgba(255, 51, 0, 0.3)" v-html="localize.header.ethwalletNotunLockOrInstall"></div>
          <div v-else>
            <!-- 以太坊已连接 -->
            <span v-if="eAccount == false">
              {{ localize.header.ethwalletLock }}
            </span>
            <span v-else>
              <a type="button" class="btn neon" style="background-color: rgba(0, 255, 115, 0.3)" @click="() => $router.push('/play')">
                {{ localize.header.ethwalletunLock }}
              </a>
              <br />
              <!-- <a
                type="button"
                class="btn"
                style="background-color: rgba(0, 255, 115, 0.3)"
                href="./oldplay.html"
              >
                点此继续使用无预言机被加入日志提醒的旧前端
              </a> -->
            </span>
          </div>

          <button v-if="language == 'zh'" class="dropdown-item btn" @click="internationalization('en')">
            En
          </button>
          <button v-if="language == 'en'" class="dropdown-item btn" @click="internationalization('zh')">
            中文
          </button>
          <div v-html="localize.welcome"></div>
        </span>
      </div>
    </div>
    <!-- </header> -->
    <br />
    <div
      id="element"
      class="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-delay="10000"
      style="
          position: fixed;
          right: 1rem;
          z-index: 5;
          background-color: rgba(255, 215, 0, 0.4);
        "
    >
      <div class="toast-header" style="background-color: rgba(255, 215, 0, 0.3)">
        <img src="../assets/nash.png" class="rounded mr-2" alt="Loop∞ icon" style="width: 1rem; height: 1rem" />
        <strong class="mr-auto" style="padding-right: 1rem">{{ toastTitle }}</strong>
        <small> @{{ timeNow }}</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body" style="white-space: pre-line">
        {{ toastContent }}
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      ethereumC: false,
      eAccount: false,
      zeroAddress: "0x0000000000000000000000000000000000000000",
      addressLook: "",
      ratioWH: 1,
      //宏观数据
      defaultPage: 0,
      netWork: "UnSupportYet",
      timeNow: "",
      pageNumber: "",
      //通知数据
      toastTitle: "",
      toastContent: "",
      //国际化
      multilingual: {
        zh: {
          header: {
            totalMiner: "总铸币人",
            blockNumber: "区块高度",
            network: "当前网络",
            LNSTitle: "环域名系统 LNS",
            connecting: "区块链连接中ing……",
            loading: "⏳L⏳O⏳A⏳D⏳I⏳N⏳G⏳……加载中，请稍等",
            ethwalletNotunLockOrInstall: '以太坊钱包未解锁或未<a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=zh-CN">安装</a>',
            cfxwalletNotunLockOrInstall: 'CFX钱包未解锁或未<a href="https://chrome.google.com/webstore/detail/confluxportal/opafkgfpaamecojfkaialabagfofilmg?hl=zh-CN">安装</a>',
            ethwalletLock: "以太坊钱包未解锁",
            ethwalletunLock: "🗝钱包已解锁, 点击进入🚪",
          },
          menu: {
            mainPage: "主页",
            inquirePage: "查询",
            swapPage: "交易所",
            msgPage: "社交消息",
            lnsPage: "环域名",
            graphPage: "图表",
          },
          welcome: '<a class="btn btn-danger btn-sm" target="_blank" style="float: right;" href="https://www.yuque.com/books/share/f2a34eb8-6ab2-418a-9a04-7a275af66a4c?#" role="button">Learn More🚀</a>',
        },
        en: {
          header: {
            totalMiner: "TotalMiner",
            blockNumber: "BlockNumber",
            network: "Network",
            LNSTitle: "Loop name system",
            connecting: "Connecting block chain……",
            loading: "⏳L⏳O⏳A⏳D⏳I⏳N⏳G⏳……Please wait",
            ethwalletNotunLockOrInstall: 'Ethereum wallet locking or not<a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=zh-CN"> install</a>',
            cfxwalletNotunLockOrInstall: 'Conflux wallet locking or not<a href="https://chrome.google.com/webstore/detail/confluxportal/opafkgfpaamecojfkaialabagfofilmg?hl=zh-CN"> install</a>',
            ethwalletLock: "Ethereum wallet locking",
            ethwalletunLock: "🗝Wallet unlocked, click to enter🚪",
          },
          menu: {
            mainPage: "Home",
            inquirePage: "Account",
            swapPage: "Swap",
            msgPage: "Message",
            lnsPage: "LNS",
            graphPage: "Graph",
          },
          welcome: '<a class="btn btn-danger btn-sm" target="_blank" style="float: right;" href="https://www.yuque.com/books/share/f2a34eb8-6ab2-418a-9a04-7a275af66a4c?#" role="button">Learn More🚀</a>',
        },
      },
      language: "zh",
      localize: "",
      dt: "",
      ethereum: window.ethereum,
      web3js: null,
    };
  },
  mounted() {
    this.web3js = new Web3(window.ethereum);
    this.connectEthereums();
    this.ethereum.on("accountsChanged", async () => {
      this.connectEthereums();
    });
    this.ethereum.on("networkChanged", () => {
      this.connectEthereums();
    });
  },
  beforeMount() {
    this.localize = this.multilingual["zh"];
  },
  //方法
  methods: {
    // 国际化
    internationalization(_lg) {
      this.language = _lg;
      if (_lg == "zh") {
        this.localize = this.multilingual["zh"];
      } else if (_lg == "en") {
        this.localize = this.multilingual["en"];
      }
    },
    //—————————————————————————————————————————————————Public——————————————————————————————————————————————————————————————
    clipboardSuccess() {
      this.updateToastAndShow("CP", "地址长度错误@查询其他代币余额");
    },
    rdm() {
      return String(Math.floor(Math.random() * 256) + ",");
    },

    // 数据处理方法
    _formatBigNumber(_bn) {
      // return web3js.utils.fromWei(_bn, 'ether');
      return parseFloat(this.web3js.utils.fromWei(_bn, "ether")).toLocaleString();
      // parseFloat().toLocaleString();
    },
    async initInfo() {
      await this.getBlockHeight();
      await this.getLoopTotalSupply();
      // this.getMyLNS();
      this.getMyMintingInWallet();
    },
    // 数据获取方法
    async intervalRefresh() {
      await this.initInfo();
      // await this.getMyLNS();
    },
    delyRefresh() {
      this.getMyMintingInWallet();
    },

    async RefreshAccount() {
      this.addressNow = (await this.ethereum.request({ method: "eth_accounts" }))[0];
      // this.lookMessageAddress = this.addressNow;
    },
    connectEthereums() {
      try {
        this.ethereum.request({ method: "eth_requestAccounts" }).then(accounts => {
          console.log("connection...");
          this.ethereumC = true;
          this.eAccount = accounts[0];
          console.log(this.eAccount);
        });
      } catch (error) {
        console.log("found error");
        console.log(error);
        this.ethereumC = false;
      }
    },
  },
};
</script>
