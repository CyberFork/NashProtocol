<template>
  <div id="play" style="width: 100%;">
    <!-- <star></star> -->
    <br />
    <!-- 游戏区域 -->
    <div v-if="NAPContract == undefined"></div>
    <div v-else>
      <div class="row">
        <div class="col-8" style="min-width: 13rem;">
          <aside>
            <div class="card">
              <div class="card-body">
                <!-- 创建预言机卡片 -->
                <!-- 散点图 -->
                <Charts :options="historyLogs" style="height: 300px"></Charts>
                <!-- 菜单tab -->
                <a-tabs :activeKey="activeKey" @change="callback" class="strategy-tabs" animated>
                  <!-- 大厅 -->
                  <a-tab-pane v-show="tabMode === 1" key="0" disabled>
                    <a-tag slot="tab" color="purple">
                      <a-icon type="reconciliation" style="font-size: 16px;vertical-align: -50%;" />
                      大厅 >>>
                    </a-tag>
                  </a-tab-pane>
                  <!-- 可加入的 -->
                  <a-tab-pane v-if="tabMode === 1" key="1" tab="可加入的">
                    <a-list :grid="{ gutter: 16, column: 2 }" :data-source="myLogs" v-if="activeKey === '1'">
                      <a-list-item slot="renderItem" slot-scope="oracleData, index">
                        <!-- 可加入的卡片 -->
                        <a-card size="small" v-show="joiningOracleID !== oracleData.OracleID">
                          <a-card-meta style="text-align:left;font-weight: bold;margin-top: 10px">
                            <template slot="title">
                              <span>#{{ oracleData.OracleID }}</span>
                            </template>
                            <template slot="avatar">
                              <icon-font type="icon-goldcup" style="margin-right: 5px"></icon-font><span>{{ web3js.utils.fromWei(String(oracleData.joinFee), "ether") }}${{ coinName[netWork] }}</span>
                            </template>
                          </a-card-meta>
                          <a-divider style="margin:12px 0"></a-divider>
                          <a-card-grid>
                            <div>
                              <div class="strategy-tabs-icon">
                                <a-icon type="check" :style="{ transform: 'translate(-100%, -30%)' }" />
                              </div>
                              <span>**** NAP</span>
                            </div>
                            <div>
                              <span>**** BNB/NAP</span>
                            </div>
                          </a-card-grid>
                          <a-card-grid>
                            <div class="strategy-tabs-icon"><a-icon type="loading" :style="{ transform: 'translate(-100%, -30%)' }" /></div>
                            <span>等待加入</span>
                          </a-card-grid>
                          <a-divider style="opacity:0"></a-divider>
                          <div class="strategy-tabs-div-left">
                            <a-icon type="block" :style="{ 'font-size': '16px', 'margin-right': '5px' }" /><span>{{ oracleData.markBlock }}</span>
                          </div>
                          <div class="strategy-tabs-div-right">
                            <a-icon type="hourglass" :style="{ 'font-size': '16px', 'margin-right': '5px' }" /><span>{{ oracleData.waitBlocks }}</span>
                          </div>
                          <a-divider style="opacity:0"></a-divider>
                          <div style="margin-bottom: 1em">
                            <a-button
                              type="primary"
                              @click="
                                {
                                  joiningOracleID = oracleData.OracleID;
                                  oracle_join_joinfee = oracleData.joinFee;
                                }
                              "
                              >加入对局</a-button
                            >
                          </div>
                        </a-card>

                        <!-- 可加入的卡片步骤二 -->
                        <a-card size="small" v-show="joiningOracleID === oracleData.OracleID">
                          <a-card-meta style="text-align:left;font-weight: bold;margin-top: 10px">
                            <template slot="title">
                              <a-icon type="arrow-left" @click="joiningOracleID = ''" />
                            </template>
                            <template slot="avatar">
                              <icon-font type="icon-goldcup" style="margin-right: 5px"></icon-font><span>{{ web3js.utils.fromWei(String(oracleData.joinFee), "ether") }}${{ coinName[netWork] }}</span>
                            </template>
                          </a-card-meta>
                          <a-divider style="margin:12px 0"></a-divider>
                          <!-- 支付区 -->
                          <br />
                          <div>
                            <p style="text-align: left;margin-left: 5em;">你 支付</p>
                            <p style="text-align: left;margin-left: 5em;">NAP</p>
                            <a-input size="large" class="strategy-tabs-input" type="number" v-model="oracle_joing_bidFee"> </a-input>
                          </div>
                          <br />
                          <!-- 策略区 -->
                          <div class="bg-card padding-box">
                            <a-button size="large" class="btn-warning neon" @click="oracle_myStrategy = 1">
                              ✌
                            </a-button>
                            <a-divider type="vertical" />
                            <a-button size="large" class=" btn-success neon" @click="oracle_myStrategy = 2">
                              ✊
                            </a-button>
                            <a-divider type="vertical" />
                            <a-button size="large" class=" btn-info neon" @click="oracle_myStrategy = 3">
                              ✋
                            </a-button>
                          </div>
                          <a-divider style="opacity:0"></a-divider>
                          <small v-if="(oracle_join_joinfee != '') & (oracle_joing_bidFee != '')" style="text-align: center;display: block;">
                            【{{ oracle_joing_bidFee / (oracle_join_joinfee * 0.95) }} $NAP/${{ coinName[netWork] }}】
                          </small>
                          <br />
                          <div style="margin-bottom: 1em"><a-button type="primary" @click="joinOracleAndSetGoteRawStg(oracleData)">提交报价</a-button></div>
                        </a-card>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 我创建的 -->
                  <a-tab-pane v-show="tabMode === 1" key="-1" disabled>
                    <a-tag slot="tab" color="purple">
                      <a-icon type="reconciliation" style="font-size: 16px;vertical-align: -50%;" />
                      我创建的 >>>
                    </a-tag>
                  </a-tab-pane>
                  <!-- 等待加入 -->
                  <a-tab-pane v-if="tabMode === 1" key="2" tab="等待加入" force-render>
                    <a-list :grid="{ gutter: 16, column: 2 }" :data-source="myLogs" v-if="activeKey === '2'">
                      <a-list-item slot="renderItem" slot-scope="item, index">
                        <!-- 加入卡片 -->
                        <a-card size="small" v-show="item.event === 'newOracleCreateAndHashStgSet'">
                          <a-card-meta style="text-align:left;font-weight: bold;margin-top: 10px">
                            <template slot="title">
                              <span>#{{ item.returnValues.OracleID }}</span>
                            </template>
                            <template slot="avatar">
                              <icon-font type="icon-goldcup" style="margin-right: 5px"></icon-font><span>{{ web3js.utils.fromWei(String(item.returnValues.JoinFee), "ether") }}${{ coinName[netWork] }}</span>
                            </template>
                          </a-card-meta>
                          <a-divider style="margin:12px 0"></a-divider>
                          <a-card-grid>
                            <div>
                              <div class="strategy-tabs-icon">
                                <a-icon type="check" :style="{ transform: 'translate(-100%, -30%)' }" />
                              </div>
                              <span>**** NAP</span>
                            </div>
                            <div>
                              <span>**** BNB/NAP</span>
                            </div>
                          </a-card-grid>
                          <a-card-grid>
                            <div class="strategy-tabs-icon"><a-icon type="loading" :style="{ transform: 'translate(-100%, -30%)' }" /></div>
                            <span>等待加入</span>
                          </a-card-grid>
                          <a-divider style="opacity:0"></a-divider>
                          <div class="strategy-tabs-div-left">
                            <a-icon type="block" :style="{ 'font-size': '16px', 'margin-right': '5px' }" /><span>{{ item.blockNumber }}</span>
                          </div>
                          <div class="strategy-tabs-div-right">
                            <a-icon type="hourglass" :style="{ 'font-size': '16px', 'margin-right': '5px' }" /><span>{{ item.returnValues.WaitBlocks }}</span>
                          </div>
                          <a-divider style="opacity:0"></a-divider>
                          <div style="margin-bottom: 1em"><a-button type="primary">加入对局</a-button></div>
                        </a-card>
                        <!-- 等待仲裁 -->
                      </a-list-item>
                    </a-list>
                    <!-- 日志菜单 -->
                    <!-- <span v-if="!oracleMenu">
                      <h5 class="card-title">My Oracles:</h5>
                      <button style="width: 100%;margin-bottom: 5px;" type="button" class="btn btn-success" @click="getMyCreateLogs">
                        My Created
                      </button>
                      <button style="width: 100%;margin-bottom: 5px;" type="button" class="btn btn-success" @click="getMyJoinedLogs">
                        My Joined
                      </button>
                      <button style="width: 100%;margin-bottom: 5px;" type="button" class="btn btn-success" @click="getMyWonLogs">
                        My Won
                      </button>
                      <hr />
                      <h5 class="card-title">All Oracles:</h5>
                      <button style="width: 100%;margin-bottom: 5px;" type="button" class="btn btn-success" @click="getReCrLogs">
                        Recently Created
                      </button>
                      <button style="width: 100%;margin-bottom: 5px;" type="button" class="btn btn-success" @click="getReJnLogs">
                        Recently Joined
                      </button>
                      <button style="width: 100%;margin-bottom: 5px;" type="button" class="btn btn-success" @click="getReOvLogs">
                        Recently Over
                      </button>
                      <button style="width: 100%;margin-bottom: 5px;" type="button" class="btn btn-success" @click="getReCcd">
                        Recently Canceled
                      </button>
                    </span> -->
                  </a-tab-pane>
                  <!-- 等待仲裁 -->
                  <a-tab-pane v-show="tabMode === 1" key="3" tab="等待仲裁">
                    <a-list :grid="{ gutter: 16, column: 2 }" :data-source="myLogs" v-if="activeKey === '3'">
                      <a-list-item slot="renderItem" slot-scope="item, index"> </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 我加入的 -->
                  <a-tab-pane v-show="tabMode === 1" key="-2" disabled>
                    <a-tag slot="tab" color="purple">
                      <a-icon type="reconciliation" style="font-size: 16px;vertical-align: -50%;" />
                      我加入的 >>>
                    </a-tag>
                  </a-tab-pane>
                  <!-- 等待仲裁 -->
                  <a-tab-pane v-show="tabMode === 1" key="4" tab="等待仲裁">
                    <a-list :grid="{ gutter: 16, column: 2 }" :data-source="myLogs">
                      <a-list-item slot="renderItem" slot-scope="item, index"> </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <a-dropdown-button slot="tabBarExtraContent">
                    切换菜单
                    <a-menu slot="overlay" @click="handleTabs">
                      <a-menu-item key="1"> <a-icon type="compass" />卡片列表 </a-menu-item>
                      <a-menu-item key="2"> <a-icon type="compass" />最近日志 </a-menu-item>
                    </a-menu>
                  </a-dropdown-button>
                </a-tabs>
                <!-- 卡片列表 -->
              </div>
            </div>
          </aside>
        </div>
        <!-- 预言机面板及广告位 -->
        <div class="col-4" style="min-width: 23rem;">
          <div class="container">
            <div class="card" style="min-height: 20rem;overflow: auto;">
              <div class="card-body">
                <!-- <div style="display:inline-block;width: 100%;">
                  <span style="float:right;margin-top: 0.4rem;"> ~ #{{ parseInt(oracle_filter_IdStart) + 9 }}</span>
                  <input class="input-group-text" style="width: 30%;margin-bottom: 5px;float: right;" type="number" placeholder="OracleID >= (default is 1)" v-model="oracle_filter_IdStart" step="10" />
                  <span style="float: right;margin-top: 0.4rem;">
                    OracleID Filter: #
                  </span>
                  <h5 class="card-title">
                    {{ classificationTexts[cfBtnNumber] }}
                  </h5>
                </div> -->
                <!-- 创建预言机面板一 -->
                <div class="card-shadow" style="display:inline-block;width: 100%;">
                  <a-card :bordered="false" size="small" v-show="createOracleStep === 1 && cardMode === 1">
                    <a-card-meta style="text-align:left;font-weight: bold">
                      <template slot="title">
                        <span>创建预言机</span>
                      </template>
                      <template slot="avatar">
                        <icon-font class="avatarIcon" @click="cardMode = 2" type="icon-xueshimao" style="font-size: 24px;margin-right: 5px;"></icon-font>
                        <a-icon class="avatarIcon" @click="cardMode = 3" type="control" style="font-size: 24px" :rotate="90" />
                      </template>
                    </a-card-meta>
                    <a-divider></a-divider>
                    <!-- 策略区 -->
                    <div class="bg-card padding-box">
                      <a-button size="large" class="btn-warning neon" @click="oracle_myStrategy = 1">
                        ✌
                      </a-button>
                      <a-divider type="vertical" />
                      <a-button size="large" class=" btn-success neon" @click="oracle_myStrategy = 2">
                        ✊
                      </a-button>
                      <a-divider type="vertical" />
                      <a-button size="large" class=" btn-info neon" @click="oracle_myStrategy = 3">
                        ✋
                      </a-button>
                    </div>
                    <br />
                    <!-- 支付区 -->
                    <div style="width: 95%;margin:auto">
                      <p style="text-align: left;margin-left: 10px;">你 支付</p>
                      <a-input-group compact>
                        <a-select style="width:100px;" class="strategy-select" v-model="create_joinfee.unit">
                          <a-select-option v-for="item in tokens" :key="item" :value="item">{{ item }}</a-select-option>
                        </a-select>
                        <a-input class="strategy-input" type="number" v-model="create_joinfee.number"> </a-input>
                      </a-input-group>
                    </div>
                    <br />
                    <div class="bg-card-bottom">
                      <a-icon class="strategy-icon" type="swap" :rotate="90" />
                      <br />
                      <p style="text-align: left;margin-left: 10px;">你 支付</p>
                      <a-input-group compact>
                        <a-select style="width:100px;" class="strategy-select strategy-bottom" v-model="create_bidFee.unit">
                          <a-select-option v-for="item in tokens" :key="item" :value="item">{{ item }}</a-select-option>
                        </a-select>
                        <a-input class="strategy-input-bottom" type="number" v-model="create_bidFee.number"> </a-input>
                      </a-input-group>
                      <br />
                      <a-button style="width:70%" type="primary " @click="createOracleAndSetHashStg1">下一步</a-button>
                    </div>
                    <br />
                    <small v-if="(create_joinfee.number != '') & (create_bidFee.number != '')" style="text-align: center;display: block;">
                      【{{ create_bidFee.number / (create_joinfee.number * 0.95) }} $NAP/${{ coinName[netWork] }}】
                      <br />
                      【{{ (create_joinfee.number * 0.95) / create_bidFee.number }} ${{ coinName[netWork] }}/$NAP】
                    </small>
                  </a-card>
                  <!-- 创建预言机面板二 -->
                  <a-card :bordered="false" size="small" v-show="createOracleStep === 2 && cardMode === 1">
                    <a-card-meta style="text-align:left;font-weight: bold">
                      <template slot="title">
                        <span>随机数祈福</span>
                      </template>
                      <template slot="avatar">
                        <icon-font class="avatarIcon" @click="cardMode = 2" type="icon-xueshimao" style="font-size: 24px;margin-right: 5px;"></icon-font>
                        <a-icon class="avatarIcon" @click="cardMode = 3" type="control" style="font-size: 24px" :rotate="90" />
                      </template>
                    </a-card-meta>
                    <a-divider></a-divider>
                    <!-- 画板区 -->
                    <div class="bg-card padding-box-bg">
                      <div style="background-color:#fff">
                        <icon-font type="icon-qifupai" style="font-size:32px" />祈福种子
                        <my-canvas @drawSeed="randomNum"></my-canvas>
                      </div>
                      <a-divider style="margin:12px 0;"></a-divider>
                      <!-- 种子区 -->
                      <a-input placeholder="请输入种子" v-model="create_rawEntropy">
                        <icon-font @click="randomNum" slot="addonAfter" type="icon-Dice" style="font-size:24px" :spin="diceSpin" />
                      </a-input>
                    </div>
                    <br />
                    <a-button style="width:70%" type="primary " @click="createOracleAndSetHashStg2">创建预言机</a-button>
                  </a-card>
                  <!-- 设置区 -->
                  <a-card :bordered="false" size="small" v-show="cardMode === 3">
                    <a-card-meta style="text-align:left;font-weight: bold">
                      <template slot="title">
                        <span>设置</span>
                      </template>
                      <template slot="avatar">
                        <icon-font class="avatarIcon" @click="cardMode = 2" type="icon-xueshimao" style="font-size: 24px;margin-right: 5px;"></icon-font>
                        <a-icon class="avatarIcon" @click="cardMode = 3" type="control" style="font-size: 24px" :rotate="90" />
                      </template>
                    </a-card-meta>
                    <a-divider></a-divider>
                    <!-- 设置区 -->
                    <div style="width: 95%;margin:auto">
                      <p style="text-align: left;margin-left: 10px;">仲裁等待时长</p>
                      <p style="text-align: left;margin-left: 10px;">
                        在等待时长结束前未完成仲裁，则您会被自动判负仲裁速度越快，越容易获得注意
                      </p>
                      <br />
                      <a-input placeholder="区块个数(默认1000)" class="control-input" type="text" v-model="oracle_create_waitblocks">
                        <span slot="addonAfter">约15分钟</span>
                      </a-input>
                    </div>
                    <br />
                    <!-- 选择速度 -->
                    <div class="bg-card padding-box">
                      <a-button size="small" @click="oracle_create_waitblocks = 1000">
                        快速
                      </a-button>
                      <a-divider type="vertical" />
                      <a-button size="small" @click="oracle_create_waitblocks = 2000">
                        正常
                      </a-button>
                      <a-divider type="vertical" />
                      <a-button size="small" @click="oracle_create_waitblocks = 4000">
                        较慢
                      </a-button>
                      <a-divider type="vertical" />
                      <a-button size="small" @click="oracle_create_waitblocks = 0">
                        自定义
                      </a-button>
                    </div>
                    <br />
                    <a-button style="width:70%" type="primary " @click="cardMode = 1">返回</a-button>
                  </a-card>
                  <!-- 教学区 -->
                  <a-card :bordered="false" size="small" v-show="cardMode === 2">
                    <a-card-meta style="text-align:left;font-weight: bold">
                      <template slot="title">
                        <span>教学</span>
                      </template>
                      <template slot="avatar">
                        <icon-font class="avatarIcon" @click="cardMode = 2" type="icon-xueshimao" style="font-size: 24px;margin-right: 5px;"></icon-font>
                        <a-icon class="avatarIcon" @click="cardMode = 3" type="control" style="font-size: 24px" :rotate="90" />
                      </template>
                    </a-card-meta>
                    <a-divider></a-divider>
                    <!-- 教学 -->
                    <div style="width: 95%;margin:auto">
                      <h3 style="text-align: left;margin-left: 10px;">如何发起</h3>
                      <p style="text-align: left;margin-left: 10px;">
                        发起步骤为：设置报价策略-->设置加密随机数祈福
                      </p>
                      <p style="text-align: left;margin-left: 10px;">
                        设置报价策略时系统会根据现价自动计算出当前标准报价 发起者可自行修改报价数值，系统会自动计算偏移率
                      </p>
                      <p style="text-align: left;margin-left: 10px;">
                        在设置随机数时可以通过绘画 + 随机输入种子进行加密 可以不设置随机数直接提交，系统会自动加密
                      </p>
                      <h3 style="text-align: left;margin-left: 10px;">参赛规则</h3>
                      <p style="text-align: left;margin-left: 10px;">
                        发起方需要在挑战者完成报价后，在限定时间内进行仲裁
                      </p>
                      <p style="text-align: left;margin-left: 10px;">
                        若未在时限内进行仲裁，则看作发起者猜拳失败 获胜方需要在战局记录中手动结束以获取奖励
                      </p>
                      <h3 style="text-align: left;margin-left: 10px;">输赢规则</h3>
                      <p style="text-align: left;margin-left: 10px;">
                        判定顺序为：猜拳轮-->预言机报价轮
                      </p>
                      <p style="text-align: left;margin-left: 10px;">
                        猜拳轮获胜的一方可以获得对方的赌注（扣除手续费)
                      </p>
                      <p style="text-align: left;margin-left: 10px;">猜拳平局后则判定预言机报价较高的一方报价成功 报价成功的一方需要将自己的赌注和对方的报价进行交换</p>
                      <p style="text-align: left;margin-left: 10px;">若是报价轮也平局则会给双方退回赌注和报价（扣除手续费）</p>
                    </div>
                    <br />
                    <a-button style="width:70%" type="primary " @click="cardMode = 1">返回</a-button>
                  </a-card>
                </div>
              </div>
              <br />
              <!-- 报价奖励 -->
              <div class="card-body">
                <div class="card-shadow" style="display:inline-block;width: 100%;">
                  <a-card>
                    <a-card-meta style="text-align:left;font-weight: bold">
                      <template slot="title">
                        <span>报价奖励</span>
                      </template>
                    </a-card-meta>
                    <a-divider></a-divider>
                    <div>
                      <span>1000 NAP</span
                      ><a-button
                        style="border: 0;
                        background: gray;
                        margin-left: 5em;"
                        type="primary"
                        >收取</a-button
                      >
                    </div>
                  </a-card>
                </div>
              </div>
              <br />
              <!-- 广告面板 -->
              <div class="card-body">
                <div class="card-shadow" style="display:inline-block;width: 100%;">
                  <a-carousel effect="fade" autoplay>
                    <div>
                      <span class="neon"><img style="float: left;margin: 40px -20px 0 40px;" src="../assets/nash.png" /><span>NASH Protocol 全球首家博弈报价预言机</span></span>
                    </div>
                    <div>
                      <span class="neon"><img style="float: left;margin: 65px -60px 0px 100px;" src="../assets/loop_mini.png" /><span>LOOP 未来的信任网络</span></span>
                    </div>
                  </a-carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <!-- 底部菜单 -->
      <div style="float: none;margin-bottom: 5px;z-index: 1;">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                $NAPToken contract @:<a :href="`https://${blockExplorer[netWork]}/address/` + NAPAddress" target="blank"
                  >{{ NAPAddress }}<a class="toCopy" style="cursor: pointer;" :data-clipboard-text="NAPAddress">📑</a>
                </a>
                <br />
                Your Wallet :<a :href="`https://${blockExplorer[netWork]}/address/` + addressNow" target="blank">{{ addressNow }}</a> [ {{ napsInWalletF }} $NAP]
                <hr />
                <h5 class="card-title">PCO $NAP</h5>
                <span class="btn btn-success" style="cursor:pointer;width: 100%;" @click="claimNAP()" title="To wallet">⬆——Click to claim: {{ napsUnclaimF }} $NAP to wallet——🎉</span>
                <hr />
                <h5 class="card-title">
                  Shares:
                  <a target="_blank" :href="swapURL[netWork]"> {{ swapNAME[netWork] }}</a>
                  <button type="button" class="btn btn-light" @click="thisroveLPs()" style="float: right;" :title="`thisrove $NAP-${coinName[netWork]} LPToken for this Contract`">
                    thisrove
                  </button>
                </h5>
                <div class="row" style="margin-bottom: 5px;">
                  <div class="col-7">
                    <a :title="`My $NAP-{{coinName[netWork]}} LPToken Locked Mining`">{{ lpTokenLockedF }} {{ pairName[netWork] }} LPToken</a>
                  </div>
                  <div class="col-5" :title="'My Hoe in Pool proportion:' + myLPproportion + '%'">
                    <span style="position: absolute;left: -0.4rem;top: -0.3rem;">⛏</span>
                    <span class="progress">
                      <span class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" :style="'width: ' + myLPproportion + '%'">
                        {{ myLPproportion }}%</span
                      >
                    </span>
                  </div>
                </div>
                <div class="col-12">
                  <div class="btn-group" role="group" aria-label="First group" style="cursor:pointer;width: 100%;">
                    <input type="number" class="form-control" v-model="LPs_v_WD" placeholder="Amount" aria-label="Amount" />
                    <button type="button" class="btn btn-primary" @click="deposits(LPs_v_WD)" title="To mine field.">
                      ↑deposit
                    </button>
                    <button type="button" class="btn btn-primary" @click="withdraws(LPs_v_WD)" title="To wallet">
                      ↓withdraw
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" class="btn btn-secondary" @click="claimAllETH()" title="To wallet." style="width: 100%;">unClaim ${{ coinName[netWork] }}: {{ ethUnclaimF }} Click to ClaimALL</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 等待卡片 -->
    <a-modal :visible="staticBackdropPending" :footer="null" :closable="false" centered id="staticBackdropPending" style="position: fixed;top:30%">
      <div>
        <div>
          <div class="modal-header">
            <h5 v-if="isPending" class="modal-title" id="staticBackdropLabel">
              Do not refuse! If you sent the transaction.
            </h5>
            <button v-if="!isPending" type="button" class="close" @click="closePending">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="text-align: center;">
            <div class="spinner-border text-success" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-border text-warning" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-border text-danger" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div class="spinner-border text-dark" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <b>
              ⏳Pending……
            </b>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </a-modal>
    <!-- 仲裁卡片 -->
    <a-modal :visible="staticBackdropAnnealed" :footer="null" :closable="false" centered id="staticBackdropAnnealed" style="position: fixed;top:30%">
      <div>
        <div>
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">
              🎊Oracle Annealed!
            </h5>
            <button type="button" class="close" @click="closeAnnealed">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {{ oracleOverContent }}
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </a-modal>
    <!-- 加入卡片 -->
    <a-modal :visible="staticBackdropJoined" :footer="null" :closable="false" centered id="staticBackdropJoined" style="position: fixed;top:30%">
      <div>
        <div>
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">
              {{ oracleJoinedTitle }}
            </h5>
            <button type="button" class="close" @click="closeJoinedOracle">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {{ oracleJoinedContent }}
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </a-modal>
    <!-- 创建提示卡片 -->
    <a-modal v-model="confirmCreateOracle" title="确认创建信息" @ok="handleCreateOracle">
      <p>waitBlock： 【{{ oracle_create_waitblocks }}】</p>
      <p>JoinFee： 【{{ create_joinfee.number }}】 {{ coinName[netWork] }}</p>
      <p>BidFee: 【{{ create_bidFee.number }}】 $NAP for 95% JoinFee</p>
      <p>EntropyRaw: 【{{ create_rawEntropy }}】</p>
      <p>Strategy: 【{{ fingers[oracle_myStrategy] }}】</p>
    </a-modal>
    <!-- 加入提示卡片 -->
    <a-modal v-model="confirmJoinOracle" title="确认加入信息" @ok="handleJoinOracle">
      <p>waitBlock： 【{{ oracle_create_waitblocks }}】</p>
      <p>JoinFee： 【{{ web3js.utils.fromWei(String(create_joinfee.number), "ether") }}】 {{ coinName[netWork] }}</p>
      <p>BidFee: 【{{ create_bidFee.number }}】 $NAP for 95% JoinFee</p>
      <p>Strategy: 【{{ fingers[oracle_myStrategy] }}】</p>
    </a-modal>
  </div>
</template>

<script>
// import star from "../components/Star.vue";
import { notification, message } from "ant-design-vue";
import Web3 from "web3";
import { LocalData, LocalData_Cache, LocalData_Sent, LocalData_WaitJoin, myDate } from "../util/StorageUtils.js";
import NAP_MVP_API from "../util/API_NAP_MVP.js";
import Charts from "../components/Charts.vue";
import { IconFont } from "../icons/my-icon.js";
import MyCanvas from "../components/My-Canvas.vue";

export default {
  components: {
    // star
    // svgIcon,
    MyCanvas,
    IconFont,
    Charts,
  },
  data() {
    return {
      // 初始化数据
      NAPAddress: null,
      NAPContract: null,
      LPAddress: null,
      LPContract: null,
      LS_NetWork: null,
      getNetworkInterval: null,
      ethereum: window.ethereum,
      web3js: new Web3(window.ethereum),
      addressNow: "0x0000000000000000000000000000000000000000",
      //LocalData_Cache.fetch(),
      LSCache: "",
      //LocalData_Sent.fetch(),
      LSSent: "",
      LSWaitJoin: "",
      LSD: LocalData.fetch(),

      //宏观数据
      TotalSupply: 0,
      SpiritComingEvents: "",
      BlockNumber: 0,
      timeNow: myDate.toLocaleDateString() + "-" + myDate.toLocaleTimeString(),
      totalLPLocked1e18: "",
      classificationTexts: {
        99: "Click Left Side Button to show",
        0: "Able to join",
        1: "Wait join",
        2: "Wait anneal",
        3: "Wait anneal",
      },
      cfBtnNumber: 99,
      oracleMenu: true,
      netWork: "",
      coinName: {
        Ethereum: "ETH",
        Truffle: "ETH",
        xDAI: "ETH",
        Kovan: "ETH",
        BSC: "BNB",
        BSCTest: "BNB",
      },
      blockExplorer: {
        Kovan: "kovan.etherscan.io",
        BSC: "bscscan.com",
        BSCTest: "testnet.bscscan.com",
      },
      swapURL: {
        Kovan: "https://this.uniswap.org/#/swap?outputCurrency=0x0D54464EC49818BDaf6f42f465025A06CbD68ffD",
        BSC: "https://this.unisave.exchange/#/swap?inputCurrency=0x4d05de8d57b238457d62dadd6d3b395bbc8c9824&outputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56",
      },
      swapNAME: {
        Kovan: "$NAP-$ETH LPToken of Uniswap",
        BSC: "$NAP-$BUSD LPToken of Unisave",
      },
      pairName: { Kovan: "$NAP-$ETH", BSC: "$NAP-$BUSD" },
      NAPDBN: { Kovan: 23370920, BSC: 5094625 },

      //个人数据
      oracle_myStrategy: 0,
      napsInWallet1e18: 0,
      napsInWalletF: 0,
      NAPs_v_WD: "",
      LPs_v_WD: "",
      napsUnclaim1e18: 0,
      napsUnclaimF: 0,
      lpTokenLocked1e18: 0,
      lpTokenLockedF: 0,
      ethUnclaim1e18: 0,
      ethUnclaimF: 0,
      myLPproportion: 0,

      //通知数据
      toastTitle: "NASH #0 MVP",
      toastContent:
        "Welcome to NASH protocol. This page is the interface of #0 MVP Contract which is the first contract of NASH——100 plan. \
                This toast will been used to show notification when get feedback from blockChain and will auto close in 5 mins.",

      //Oracle数据
      isPending: false,
      oracle_filter_joinfee: "",
      oracle_filter_waitblocks: "",
      oracle_filter_IdStart: LocalData.fetch()[0] == undefined ? 1 : LocalData.fetch()[0], // LocalData.fetch(),
      oracle_create_joinfee: "",
      oracle_create_waitblocks: "",
      oracle_create_rawEntropy: "",
      oracle_create_bidFee: "",
      fingers: { 0: "🤝", 201: "💡", 1: "✌", 2: "✊", 3: "✋" },
      //现在已经没有255
      stateMthising: {
        255: "Wait join",
        201: "Joined&setStg",
        1: "✌",
        2: "✊",
        3: "✋",
      },
      OracleDatas: [],
      OracleLogs: [],
      // 1:in lobby not joined ,2:wait you to anneal ,3: wait init to anneal,4:expired
      FilterState: 0,
      MyState: 0,
      filterText: {
        1: "Create@",
        2: "Expire@",
        3: "Will expire@",
        4: "Already expired@",
      },
      filterButtonText: {
        1: { 0: "Able to join", 201: "Wait Gote Join" },
        2: { 4: "My Joined", 201: "My Created wait gote" },
        3: "Wait Anneal",
        4: "Expired",
      },
      LimitsReturn: 10,
      alertAtOracleCreate: "",
      showAlertAtOracleCreate: false,
      joiningOracleID: "",
      joiningOracleCreateAt: "",
      joiningOracleJoinFee: "",
      joiningOracleWaitBlock: "",
      joiningOraclePrize: "",
      oracle_joing_bidFee: "",
      oracle_join_joinfee: "",
      oracle_overReason: {
        0: "AnnealInitWin",
        1: "AnnealGoteWin",
        2: "CriticalAnnealed",
        3: "AnnealExpiredOracle",
      },

      /// oracle logs
      logsType: 0,
      historyLogs: {},
      myLogs: [],
      /// dialogs
      oracleOverContent: "",
      oracleJoinedTitle: "",
      oracleJoinedContent: "",
      dt: "",
      // 交互数据
      oracleId: "",
      tabMode: 1,
      cardMode: 1,
      activeKey: "1",
      diceSpin: false,
      tagCardMode: 1,
      createOracleStep: 1,
      confirmJoinOracle: false,
      confirmCreateOracle: false,
      staticBackdropPending: false,
      staticBackdropAnnealed: false,
      staticBackdropJoined: false,
      staticBackdropCreateOracle: true,
      staticBackdropJoinOracle: false,
      // create data new
      tokens: ["NAP", "Y3D", "SAVE", "MASK", "META", "BNB"],
      create_joinfee: {
        unit: "BNB",
        number: 0,
      },
      create_bidFee: {
        unit: "NAP",
        number: 0,
      },
      create_rawEntropy: "",
    };
  },
  watch: {
    oracle_filter_IdStart: {
      handler: function(oracle_filter_IdStart) {
        this.LSD[0] = oracle_filter_IdStart;
        LocalData.save(this.LSD);
      },
      deep: true,
    },
  },
  created() {
    this.ethereum.request({ method: "eth_requestAccounts" }).then(res => {
      console.log("Now account:", res[0]);
      // -- set cyclicity refresh for set up contract instance
      this.getNetworkInterval = self.setInterval(this.getNetwork(), 2000);
      this.ethereum.autoRefreshOnNetworkChange = true;
      this.ethereum.on("chainChanged", function() {
        location.reload();
      });
      this.ethereum.on("accountsChanged", async () => {
        this.initUserData();
      });
    });
  },
  mounted() {
    this.historyLogs = {
      title: {
        // text: "ECharts 入门示例",
        text: ["{a|0.023 }{b|BNB / }{x|NAP}"],
        subtext: "$ 2.2 (+5%)过去24小时 数据来源于本站",
        lineHeight: 56,
        textStyle: {
          rich: {
            a: {
              fontSize: "18px",
            },
            b: {
              color: "gray",
              // height: 40,
            },
            x: {
              fontSize: 18,
              fontWeight: "bold",
              fontFamily: "Microsoft YaHei",
            },
          },
        },
      },
      grid: {
        show: true,
        containLabel: false,
        backgroundColor: "rgba(242, 242, 242, 1)",
        x: 80,
        y: 60,
        x2: 80,
        y2: 60,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      toolbox: {
        show: true,
        itemSize: 24,
        emphasis: {
          iconStyle: {
            textFill: "rgba(0, 0, 0, 1)",
          },
        },
        feature: {
          myTool1: {
            show: true,
            title: "24小时",
            icon:
              "path://M725.333333 554.666667a42.666667 42.666667 0 1 1 0 85.333333v21.333333a42.666667 42.666667 0 1 1-85.333333 0v-21.333333h-106.666667a42.666667 42.666667 0 0 1-39.957333-57.642667l64-170.666666a42.666667 42.666667 0 0 1 79.914667 29.952L594.901333 554.666667H640v-42.666667a42.666667 42.666667 0 1 1 85.333333 0v42.666667z m128-364.842667V85.333333a42.666667 42.666667 0 1 1 85.333334 0v213.333334a42.666667 42.666667 0 0 1-42.666667 42.666666H682.666667a42.666667 42.666667 0 1 1 0-85.333333h115.584C726.464 175.68 623.317333 128 512 128 299.925333 128 128 299.925333 128 512s171.925333 384 384 384 384-171.925333 384-384a42.666667 42.666667 0 1 1 85.333333 0c0 259.2-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667c131.648 0 254.08 54.656 341.333333 147.157333z m-409.216 369.706667L392.533333 618.666667H426.666667a42.666667 42.666667 0 1 1 0 85.333333h-128c-36.629333 0-56.234667-43.114667-32.149334-70.72l112.597334-129.024A21.333333 21.333333 0 1 0 341.333333 490.666667a42.666667 42.666667 0 1 1-85.333333 0 106.666667 106.666667 0 0 1 213.333333 0c0 25.152-8.789333 49.066667-25.216 68.864z",
            onclick: function() {
              alert("myToolHandler1");
            },
          },
          myTool2: {
            show: true,
            title: "1周",
            icon:
              "path://M931.6 585.6l0 79c28.6-60.2 44.8-127.4 44.8-198.4C976.4 211 769.4 4 514.2 4S52 211 52 466.2c0 3.2 0.2 6.4 0.2 9.6l166-206 96.4 0L171.8 485.6l46.4 0 0-54.8 99.2-154.6 0 209.4 0 100 0 82.4-99.2 0 0-82.4L67.6 585.6c43 161 170.6 287.4 332.4 328.6-10.4 26.2-40.6 89.4-90.8 100.6-62.2 14 168.8 3.4 333.6-104.6 126.6-36.6 230.8-125.8 287.4-242.2l-97.6 0 0-82.4-166.2 0 0-87.2 0-12.8L666.4 476l166.2-206.2 94 0-140.4 215.8 46.4 0 0-59 99.2-154 0 213.2L931.8 585.6zM366.2 608c-4.8-11.2-7.2-23.2-7.2-36L359 357.6c0-12.8 2.4-24.8 7.2-36 4.8-11.2 11.4-21 19.6-29.2 8.2-8.2 18-14.8 29.2-19.6 11.2-4.8 23.2-7.2 36-7.2l81.6 0c12.8 0 24.8 2.4 36 7.2 11 4.8 20.6 11.2 28.8 19.2l-88.6 129.4 0-23c0-4.8-1.6-8.8-4.8-12-3.2-3.2-7.2-4.8-12-4.8-4.8 0-8.8 1.6-12 4.8-3.2 3.2-4.8 7.2-4.8 12l0 72L372.6 620C370.2 616.2 368 612.2 366.2 608zM624.4 572c0 12.8-2.4 24.8-7.2 36-4.8 11.2-11.4 21-19.6 29.2-8.2 8.2-18 14.8-29.2 19.6-11.2 4.8-23.2 7.2-36 7.2l-81.6 0c-12.8 0-24.8-2.4-36-7.2-11.2-4.8-21-11.4-29.2-19.6-3.6-3.6-7-7.8-10-12l99.2-144.6 0 50.6c0 4.8 1.6 8.8 4.8 12 3.2 3.2 7.2 4.8 12 4.8 4.8 0 8.8-1.6 12-4.8 3.2-3.2 4.8-7.2 4.8-12l0-99.6 92.6-135.2c6.6 7.4 12 15.8 16 25.2 4.8 11.2 7.2 23.2 7.2 36L624.2 572z",
            onclick: function() {
              alert("myToolHandler1");
            },
          },
          myTool3: {
            show: true,
            title: "1月",
            icon:
              "path://M931.6 585.6l0 79c28.6-60.2 44.8-127.4 44.8-198.4C976.4 211 769.4 4 514.2 4S52 211 52 466.2c0 3.2 0.2 6.4 0.2 9.6l166-206 96.4 0L171.8 485.6l46.4 0 0-54.8 99.2-154.6 0 209.4 0 100 0 82.4-99.2 0 0-82.4L67.6 585.6c43 161 170.6 287.4 332.4 328.6-10.4 26.2-40.6 89.4-90.8 100.6-62.2 14 168.8 3.4 333.6-104.6 126.6-36.6 230.8-125.8 287.4-242.2l-97.6 0 0-82.4-166.2 0 0-87.2 0-12.8L666.4 476l166.2-206.2 94 0-140.4 215.8 46.4 0 0-59 99.2-154 0 213.2L931.8 585.6zM366.2 608c-4.8-11.2-7.2-23.2-7.2-36L359 357.6c0-12.8 2.4-24.8 7.2-36 4.8-11.2 11.4-21 19.6-29.2 8.2-8.2 18-14.8 29.2-19.6 11.2-4.8 23.2-7.2 36-7.2l81.6 0c12.8 0 24.8 2.4 36 7.2 11 4.8 20.6 11.2 28.8 19.2l-88.6 129.4 0-23c0-4.8-1.6-8.8-4.8-12-3.2-3.2-7.2-4.8-12-4.8-4.8 0-8.8 1.6-12 4.8-3.2 3.2-4.8 7.2-4.8 12l0 72L372.6 620C370.2 616.2 368 612.2 366.2 608zM624.4 572c0 12.8-2.4 24.8-7.2 36-4.8 11.2-11.4 21-19.6 29.2-8.2 8.2-18 14.8-29.2 19.6-11.2 4.8-23.2 7.2-36 7.2l-81.6 0c-12.8 0-24.8-2.4-36-7.2-11.2-4.8-21-11.4-29.2-19.6-3.6-3.6-7-7.8-10-12l99.2-144.6 0 50.6c0 4.8 1.6 8.8 4.8 12 3.2 3.2 7.2 4.8 12 4.8 4.8 0 8.8-1.6 12-4.8 3.2-3.2 4.8-7.2 4.8-12l0-99.6 92.6-135.2c6.6 7.4 12 15.8 16 25.2 4.8 11.2 7.2 23.2 7.2 36L624.2 572z",
            onclick: function() {
              alert("myToolHandler1");
            },
          },
        },
      },
      dataZoom: [
        {
          id: "dataZoomX",
          type: "inside",
          xAxisIndex: [0],
          filterMode: "filter",
        },
        // {
        //   id: "dataZoomY",
        //   type: "slider",
        //   yAxisIndex: [0],
        //   filterMode: "empty",
        // },
      ],
      xAxis: [
        {
          show: true,
          // axisPointer: {
          //   show: true,
          //   label: { show: true },
          // },
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          show: false,
          axisLine: {
            show: true,
            // lineStyle: {
            //   color: colors[0],
            // },
          },
          axisLabel: {
            formatter: "{value} ml",
          },
        },
      ],
      series: [
        {
          symbolSize: 20,
          data: [
            [10.0, 8.04],
            [8.07, 6.95],
            [13.0, 7.58],
            [9.05, 8.81],
            [11.0, 8.33],
            [14.0, 7.66],
            [13.4, 6.81],
            [10.0, 6.33],
            [14.0, 8.96],
            [12.5, 6.82],
            [9.15, 7.2],
            [11.5, 7.2],
            [3.03, 4.23],
            [12.2, 7.83],
            [2.02, 4.47],
            [1.05, 3.33],
            [4.05, 4.96],
            [6.03, 7.24],
            [12.0, 6.26],
            [12.0, 8.84],
            [7.08, 5.82],
            [5.02, 5.68],
          ],
          type: "scatter",
        },
      ],
    };
  },
  methods: {
    // 1 数据处理方法
    _formatBigNumber(_bn) {
      // return web3js.utils.fromWei(_bn, 'ether');
      return parseFloat(this.web3js.utils.fromWei(_bn, "ether")).toLocaleString();
      // parseFloat().toLocaleString();
    },
    /*
     *@Author: yozora
     *@Description: 通知信息
     *@Date: 2021-03-11 17:12:54
     */
    updateToastAndShow(title, content) {
      const myDate = new Date();
      this.timeNow = myDate.toLocaleDateString() + "-" + myDate.toLocaleTimeString();
      this.toastTitle = title;
      this.toastContent = content;
      this.openNotification();
    },
    /*
     *@Author: yozora
     *@Description: 加入通知
     *@Date: 2021-03-11 17:13:40
     */
    updateAlertInOracleCreate(swc, content) {
      this.alertAtOracleCreate = content;
      this.showAlertAtOracleCreate = swc;
    },
    // 3 数据获取方法
    async RefreshAccount() {
      this.addressNow = (await this.ethereum.request({ method: "eth_accounts" }))[0];
      this.$store.commit("SET_ADDRESS", this.addressNow);
    },
    // - 周期性刷新
    async intervalRefresh() {
      await this.individual();
      await this.macroeconomic();
    },
    // 个人数据 ---- start
    async individual() {
      // 等更新之后才有default地址
      await this.getMyUnclaimNAP();
      await this.getMyUnClaimETHs();
      await this.getLPTokenProportion();
      await this.getMyNAPsInWallet();
      this.addressNow = (await this.ethereum.request({ method: "eth_accounts" }))[0];
    },
    async getMyUnclaimNAP() {
      this.napsUnclaim1e18 = await this.NAPContract.methods.PCO_NapsNowCanClaim(this.addressNow).call();
      this.napsUnclaimF = this._formatBigNumber(this.napsUnclaim1e18);
    },
    async getMyUnClaimETHs() {
      this.ethUnclaim1e18 = await this.NAPContract.methods.unClaimedETHsOf(this.addressNow).call();
      this.ethUnclaimF = this._formatBigNumber(this.ethUnclaim1e18);
    },
    async getLPTokenProportion() {
      await this.getMyLockedLP();
      await this.getTotalLPLocked();
      // console.log(Number(this.lpTokenLocked1e18), Number(this.totalLPLocked1e18))
      this.myLPproportion = (Number(this.lpTokenLocked1e18) / Number(this.totalLPLocked1e18)) * 100;
    },
    async getMyLockedLP() {
      this.lpTokenLocked1e18 = await this.NAPContract.methods.playerToHoes(this.addressNow).call();
      this.lpTokenLockedF = this._formatBigNumber(this.lpTokenLocked1e18);
    },
    async getTotalLPLocked() {
      this.totalLPLocked1e18 = await this.NAPContract.methods.totalHoesLocked().call();
      this.totalLPLockedF = this._formatBigNumber(this.totalLPLocked1e18);
    },
    async getMyNAPsInWallet() {
      this.napsInWallet1e18 = await this.NAPContract.methods.balanceOf(this.addressNow).call();
      this.napsInWalletF = this._formatBigNumber(this.napsInWallet1e18);
    },
    // 个人数据 ---- end
    // 日志数据 ---- start
    /*
     *@Author: yozora
     *@Description: 获取最近所有日志
     *@Date: 2021-03-15 18:34:05
     */
    async getAllLogs() {
      this.myLogs = [];
      // this.logsType = 4;
      const allLogs = (
        await this.NAPContract.getPastEvents("allEvents", {
          filter: {},
          fromBlock: this.BlockNumber - 49000,
        })
      ).reverse();
      this.dt = allLogs.filter(item => {
        return item.event === "newOracleCreateAndHashStgSet" || item.event === "GoteJoinedAndRawStgSet" || item.event === "OracleOver";
      });
      // this.OracleLogs = this.dt;
      this.myLogs = this.dt;
      console.log(this.myLogs);
      this.updateToastAndShow("All Oracle logs", `Fetched ${this.dt.length} Recently created logs.`);
    },
    /*
     *@Author: yozora
     *@Description: 获取最近我的所所有日志
     *@Date: 2021-03-15 21:07:17
     */
    async getAllMyLogs() {
      this.myLogs = [];
      // this.logsType = 4;
      const allLogs = (
        await this.NAPContract.getPastEvents("allEvents", {
          filter: {},
          fromBlock: this.BlockNumber - 49000,
        })
      ).reverse();
      this.dt = allLogs.filter(item => {
        return item.event === "newOracleCreateAndHashStgSet" || item.event === "GoteJoinedAndRawStgSet" || item.event === "OracleOver";
      });
      // this.OracleLogs = this.dt;
      this.myLogs = this.dt;
      this.updateToastAndShow("All Oracle logs", `Fetched ${this.dt.length} Recently created logs.`);
    },
    async getMyCreateLogs() {
      this.OracleLogs = [];
      this.logsType = 1;
      this.dt = (
        await this.NAPContract.getPastEvents("newOracleCreateAndHashStgSet", {
          filter: { Creater: this.addressNow },
          fromBlock: this.BlockNumber - 4900,
        })
      ).reverse();
      this.OracleLogs = this.dt;
      this.updateToastAndShow("My Oracle logs", `Fetched ${this.dt.length} My created logs.`);
    },
    async getMyJoinedLogs() {
      this.OracleLogs = [];
      this.logsType = 2;
      this.dt = (
        await this.NAPContract.getPastEvents("GoteJoinedAndRawStgSet", {
          filter: { Player: this.addressNow },
          fromBlock: this.BlockNumber - 4900,
        })
      ).reverse();
      this.OracleLogs = this.dt;
      this.updateToastAndShow("My Oracle logs", `Fetched ${this.dt.length} My joined logs.`);
    },
    async getMyWonLogs() {
      this.OracleLogs = [];
      this.logsType = 3;
      this.dt = (
        await this.NAPContract.getPastEvents("OracleOver", {
          filter: { Winner: this.addressNow },
          fromBlock: this.BlockNumber - 4900,
        })
      ).reverse();
      this.OracleLogs = this.dt;
      this.updateToastAndShow("My Oracle logs", `Fetched ${this.dt.length} My won logs.`);
    },
    /*
     *@Author: yozora
     *@Description: 获取最近创建日志
     *@Date: 2021-03-14 15:18:45
     */
    async getReCrLogs() {
      this.OracleLogs = [];
      this.logsType = 4;
      this.dt = (
        await this.NAPContract.getPastEvents("newOracleCreateAndHashStgSet", {
          filter: {},
          fromBlock: this.BlockNumber - 10000,
        })
      ).reverse();
      console.log(this.dt);
      this.OracleLogs = this.dt;
      this.myLogs = this.dt;
      this.updateToastAndShow("All Oracle logs", `Fetched ${this.dt.length} Recently created logs.`);
    },
    /*
     *@Author: yozora
     *@Description: 获取最近加入日志
     *@Date: 2021-03-14 15:20:32
     */
    async getReJnLogs() {
      // $('#staticBackdropPending').modal('show')
      this.OracleLogs = [];
      this.logsType = 5;
      this.dt = (
        await this.NAPContract.getPastEvents("GoteJoinedAndRawStgSet", {
          filter: {},
          fromBlock: this.BlockNumber - 4900,
        })
      ).reverse();
      this.OracleLogs = this.dt;
      // $('#staticBackdropPending').modal('hide')
      this.updateToastAndShow("All Oracle logs", `Fetched ${this.dt.length} Recently Joined logs.`);
    },
    /*
     *@Author: yozora
     *@Description: 获取最近结束日志
     *@Date: 2021-03-14 15:20:43
     */
    async getReOvLogs() {
      // $('#staticBackdropPending').modal('show')
      this.OracleLogs = [];
      this.logsType = 6;
      this.dt = (
        await this.NAPContract.getPastEvents("OracleOver", {
          filter: {},
          fromBlock: this.BlockNumber - 4900,
        })
      ).reverse();
      this.OracleLogs = this.dt;
      // $('#staticBackdropPending').modal('hide')
      this.updateToastAndShow("All Oracle logs", `Fetched ${this.dt.length} Recently over logs.`);
    },
    /*
     *@Author: yozora
     *@Description: 获取最近取消日志
     *@Date: 2021-03-15 19:12:23
     */
    async getReCcd() {
      // $('#staticBackdropPending').modal('show')
      this.OracleLogs = [];
      this.logsType = 7;
      this.dt = (
        await this.NAPContract.getPastEvents("OracleCanceled", {
          filter: {},
          fromBlock: this.BlockNumber - 4900,
        })
      ).reverse();
      this.OracleLogs = this.dt;
      // $('#staticBackdropPending').modal('hide')
      this.updateToastAndShow("All Oracle logs", `Fetched ${this.dt.length} Recently canceled logs.`);
    },
    // 日志数据 ---- end
    // 宏观数据 ----- start
    async macroeconomic() {
      if (this.NAPContract == undefined) return;
      await this.getBlockNumber();
      await this.getNAPTotalSupply();
    },
    async getNAPTotalSupply() {
      let rst = await this.NAPContract.methods.totalSupply().call();
      // console.log('ttspl',rst);
      this.TotalSupply = this._formatBigNumber(rst);
    },
    async getBlockNumber() {
      this.web3js.eth.getBlockNumber().then(rst => {
        this.BlockNumber = rst;
        // console.log(rst)
      });
    },
    // 宏观数据 ---- end

    // 4 数据写入链上方法
    async claimNAP() {
      this.updateToastAndShow("Claim $NAPs", `Pending: Claim ${this.napsUnclaimF} $NAPs to wallet …… ……`);
      // let rst = await this.NAPContract.methods.PCO_claimNAP().send({ from: this.addressNow });
      this.updateToastAndShow("Claim $NAPs", `Success: Claimed ${this.napsUnclaimF} $NAPs to wallet.`);
      await this.getMyUnclaimNAP();
      await this.getMyNAPsInWallet();
      // console.log(rst);
    },
    // create预言机
    /*
     *@Author: yozora
     *@Description: 创建预言机-策略、支付
     *@Date: 2021-03-11 16:02:56
     */
    createOracleAndSetHashStg1() {
      if (this.oracle_create_waitblocks == "") {
        this.oracle_create_waitblocks = 4000;
      }
      if (this.create_bidFee.number == "") {
        this.create_bidFee.number = 0;
      }
      if (this.oracle_myStrategy == 0) {
        message.error("Please select strategy✌✊✋.", 2);
        return;
      } else if (this.create_joinfee.number === "" || this.create_joinfee.number === 0) {
        message.error("Please full joinfee.", 2);
        return;
      } else if (Number(this.create_bidFee.number) > Number(this.napsInWallet1e18) / 1e18) {
        message.error("Insufficient $NAPs in wallet for bid fee.", 2);
        return;
      } else if (Number(this.oracle_create_waitblocks) > 4900 || Number(this.oracle_create_waitblocks) < 10) {
        message.error("WaitBlocks should be in range [10,4900].", 2);
        return;
      }
      this.createOracleStep = 2;
    },
    /*
     *@Author: yozora
     *@Description: 创建预言机-随机数
     *@Date: 2021-03-15 11:42:20
     */
    createOracleAndSetHashStg2() {
      if (this.create_rawEntropy === "") {
        message.error("Please select entropy.", 2);
        return;
      }
      this.confirmCreateOracle = true;
    },
    encryption(hsetp, stg, bid) {
      // hsetp = web3js.utils.keccak256(hsetp);
      return this.web3js.utils.keccak256(this.web3js.eth.abi.encodeParameters(["string", "uint256", "uint256"], [hsetp, stg, bid]));
    },
    /*
     *@Author: yozora
     *@Description: 取消创建预言机
     *@Date: 2021-03-15 20:59:00
     */
    cancelButtonClick(oracleData) {
      let oid = parseInt(oracleData.OracleID);
      this.updateToastAndShow(`Cancel Oracle`, `Pending: Oracle【#${oid}】 Cancel  …… ……`);
      this.NAPContract.methods
        .cancelOracle(oid)
        .send({ from: this.addressNow })
        .then(() => {
          this.updateToastAndShow("Cancel Oracle", `Success:【#${oid}】Oracle Canceled.`);
          this.getMyCreateWaitJoin();
          // 删除sent 策略释放空间
          delete this.LSSent[oid];
          LocalData_Sent.save(this.LSSent);
          // 删除监听
          this.deleteSubscribeJoin(oid);
        });
    },
    /*
      ? Deprecated
     */
    joinButtonClick(oracleData) {
      this.oracle_joing_bidFee = "";
      this.oracle_myStrategy = 0;
      this.updateAlertInOracleCreate(false, "Please select a strategy and full form.");
      this.joiningOraclePrize = parseFloat(this.web3js.utils.fromWei(String(oracleData.joinFee), "ether")) * 1.9;
      this.oracle_join_joinfee = this.web3js.utils.fromWei(oracleData.joinFee, "ether");
      this.joiningOracleID = oracleData.OracleID;
      this.joiningOracleCreateAt = oracleData.markBlock;
      this.joiningOracleJoinFee = oracleData.joinFee;
      this.joiningOracleWaitBlock = oracleData.waitBlocks;
    },
    /*
     *@Author: yozora
     *@Description: 加入预言机
     *@Date: 2021-03-17 22:48:11
     */
    joinOracleAndSetGoteRawStg(oracleData) {
      // this.oracleId = parseInt(oracleData.OracleID);
      if (this.oracle_myStrategy == 0) {
        message.error("Please select strategy✌✊✋.", 2);
        return;
      } else if (Number(this.oracle_joing_bidFee) > Number(this.napsInWallet1e18) / 1e18) {
        message.error("Insufficient $NAPs in bank for bid fee.", 2);
        return;
      }
      if (this.oracle_joing_bidFee == "") {
        this.oracle_joing_bidFee = 0;
      }
      // 更新通知信息
      this.oracle_create_waitblocks = oracleData.waitBlocks;
      this.create_joinfee.number = oracleData.joinFee;
      this.create_bidFee.number = this.oracle_joing_bidFee;

      // 更新加入信息
      this.oracle_join_joinfee = this.web3js.utils.fromWei(oracleData.joinFee, "ether");
      this.joiningOracleID = oracleData.OracleID;
      this.confirmJoinOracle = true;
    },
    // anneal
    async annealButtonClick(oracleData) {
      let oid = parseInt(oracleData.OracleID);
      console.log("oid", oid);
      this.updateToastAndShow("Anneal Oracle", `Getting: Oracle【#${oid}】 Opponent  …… ……`);
      // let _opponent = (await NAPContract.getPastEvents('GoteJoinedAndRawStgSet', { filter: { OracleID: oid }, fromBlock: this.NAPDBN[this.netWork] })).pop().returnValues.Player;
      let _opponent = (
        await this.NAPContract.getPastEvents("GoteJoinedAndRawStgSet", {
          filter: { OracleID: oid },
          fromBlock: this.BlockNumber - 4900,
        })
      ).pop().returnValues.Player;
      let ols = this.LSSent[oid];
      console.log(_opponent);
      console.log("ols", ols);
      // 处理加密参数丢失：未提交成功就刷新的情况
      let MissAgrs; // means not missing
      // let cacheIndex;
      if (ols == undefined) {
        MissAgrs = true; // means missing
        // 需要去cache中寻找hash对应的oid
        console.log("Start to fix missing Oracle hash preImage args", oid);
        for (let i = 0; i < this.LSCache.length; i++) {
          try {
            console.log("for index:", i);
            // let _gotOid = (await NAPContract.getPastEvents('newOracleCreateAndHashStgSet', { filter: { stgHash: this.LSCache[i].EncryptedStg }, fromBlock: this.NAPDBN[this.netWork] }))[0].returnValues.OracleID;
            let _gotOid = (
              await this.NAPContract.getPastEvents("newOracleCreateAndHashStgSet", {
                filter: { stgHash: this.LSCache[i].EncryptedStg },
                fromBlock: this.BlockNumber - 4900,
              })
            )[0].returnValues.OracleID;
            console.log("oid", oid);
            if (_gotOid == undefined) {
              console.log("index:", i, "未找到原象", oid);
              continue;
            } else if (parseInt(_gotOid) == oid) {
              // 找到了缓存hash中对应的oid
              let hsetp = this.LSCache[i].hsetp;
              let stg = this.LSCache[i].stg;
              let bid = this.LSCache[i].bid;
              this.LSSent[oid] = { hsetp, stg, bid };
              LocalData_Sent.save(this.LSSent);
              ols = { hsetp, stg, bid };
              // MissAgrs = 2// means missing and found back
              MissAgrs = false;
              // cacheIndex = i;
              delete this.LSCache[i];
              LocalData_Cache.save(this.LSCache);
            }
          } catch (error) {
            console.log("Recover stg err:", error);
          }
        }
      }
      // console.log(MissAgrs)
      if (MissAgrs) {
        this.updateToastAndShow(`Anneal Oracle【#${oid}】`, `Encryption parameter missing`);
        return;
      }

      this.updateToastAndShow(`Anneal Oracle【#${oid}】`, `Pending: Anneal Oracle …… ……`);
      this.isPending = true;
      this.staticBackdropPending = true;
      // document.getElementById("#staticBackdropPending").modal("show");
      // $('#staticBackdropPending').modal('show')
      // console.log(oid, ols.hsetp, ols.stg, ols.bid)
      let rst = await this.NAPContract.methods.makeAnneal(oid, ols.hsetp, ols.stg, ols.bid, _opponent).send({ from: this.addressNow });
      this.dt = rst;
      // 删除sent 策略释放空间
      if (rst.events.OracleOver.type == "mined") {
        delete this.LSSent[oid];
        LocalData_Sent.save(this.LSSent);
      }
      // 删除监听
      this.deleteSubscribeJoin(oid);
      this.staticBackdropPending = false;
      // document.getElementById("#staticBackdropPending").modal("hide");
      this.isPending = false;
      this.oracleOverContent = "";
      let evt = rst.events.OracleOver.returnValues;
      this.dt = evt;
      let _overTitle;
      let _overText;
      if (evt.Winner.toLowerCase() == this.addressNow) {
        _overTitle = `Annealed Oracle【#${oid}】`;
        _overText = `【😁:You Win🎉!】. 【🏆:${this.web3js.utils.fromWei(String(evt.Prize), "ether")}$${this.coinName[this.netWork]}】.【(Init) Your Stg:${this.fingers[evt.Strategy_Init]}】.【GoteStg:${
          this.fingers[evt.Strategy_Gote]
        }】.【OraclePrice:${parseFloat(String((2 * evt.ValidBid) / evt.Prize)).toLocaleString()}$NAP/$${this.coinName[this.netWork]}】.【OverReason:${this.oracle_overReason[evt.Reason]}】`;
      } else {
        _overTitle = `Annealed Oracle【#${oid}】`;
        _overText = `【Winner:${evt.Winner}】. 【🏆:${this.web3js.utils.fromWei(String(evt.Prize), "ether")}$${this.coinName[this.netWork]}】.【(Init) Your Stg:${this.fingers[evt.Strategy_Init]}】.【GoteStg:${
          this.fingers[evt.Strategy_Gote]
        }】.【OraclePrice:${parseFloat(String((2 * evt.ValidBid) / evt.Prize)).toLocaleString()}$NAP/$${this.coinName[this.netWork]}】.【OverReason:${this.oracle_overReason[evt.Reason]}】`;
      }
      this.getMyCreateWaitAnneal();

      this.oracleOverContent = _overTitle + _overText;
      this.staticBackdropAnnealed = true;
      // document.getElementById("#staticBackdropAnnealed").modal("show");
    },
    // expired
    async expiredButtonClick(oracleData) {
      let oid = parseInt(oracleData.OracleID);
      this.updateToastAndShow(`Finish expired Oracle`, `Getting: Oracle【#${oid}】 Opponent  …… ……`);
      // let _opponent = (await NAPContract.getPastEvents('newOracleCreateAndHashStgSet', { filter: { OracleID: oid }, fromBlock: this.NAPDBN[this.netWork] })).pop().returnValues.Creater;
      this.updateToastAndShow(`Finish expired Oracle`, `Pending: Finish expired Oracle【#${oid}】  …… ……`);
      let rst = await this.NAPContract.methods.finishExpiredOracle(oid).send({ from: this.addressNow });
      let evt = rst.events.OracleOver.returnValues;
      this.dt = rst;
      this.updateToastAndShow(
        `Finish expired Oracle【#${evt.OracleID}】`,
        `【😁:You win】. 【🏆:${this.web3js.utils.fromWei(String(evt.Prize), "ether")}$${this.coinName[this.netWork]}】.【OverReason:${this.oracle_overReason[evt.Reason]}】`
      );
      await this.getMyJoinedWaitAnneal();
    },
    // mining
    async thisroveLPs() {
      this.updateToastAndShow("thisrove", "thisrove #0 MVP Contract to spend your LPTokens.");
      await this.LPContract.methods.thisrove(this.NAPAddress, this.web3js.utils.toBN("115792089237316195423570985008687907853269984665640564039457584007913129639935")).send({ from: this.addressNow });
    },
    deposits(_amount) {
      if (_amount == 0) {
        this.updateToastAndShow("Error@Deposit LP", "Deposit amount can not be zero.");
        return;
      }
      this.updateToastAndShow("$LPs interaction", "Pending: Deposit $LPs hoe to #0 MVP Contract …… ……");
      this.NAPContract.methods
        .deposit(this.web3js.utils.toWei(String(_amount)))
        .send({ from: this.addressNow })
        .then(() => {
          this.updateToastAndShow("$LPs interaction", "Success: Deposit $LPs hoe to #0 MVP Contract.");
          this.intervalRefresh();
        });
    },
    withdraws(_amount) {
      if (_amount == 0) {
        this.updateToastAndShow("Error@Withdraw LP", "Withdraw amount can not be zero.");
        return;
      }
      this.updateToastAndShow("$LPs interaction", "Pending: Withdraw $LPs hoe from #0 MVP Contract …… ……");
      this.NAPContract.methods
        .withdraw(this.web3js.utils.toWei(String(_amount)))
        .send({ from: this.addressNow })
        .then(() => {
          this.updateToastAndShow("$LPs interaction", "Success: Withdraw $LPs hoe from #0 MVP Contract.");
          this.intervalRefresh();
        });
    },
    async claimAllETH() {
      this.updateToastAndShow(`Claim $${this.coinName[this.netWork]}`, `Pending: Claim ${this.ethUnclaimF} $${this.coinName[this.netWork]}s to wallet …… ……`);
      // let rst = await this.NAPContract.methods.claim().send({ from: this.addressNow });
      this.updateToastAndShow(`Claim $${this.coinName[this.netWork]}s`, `Success: Claimed ${this.ethUnclaimF} $${this.coinName[this.netWork]}s to wallet.`);
    },
    // 5 Oracle 查询方法
    async getJoinAbleOracles() {
      (this.cfBtnNumber = 0) & (this.MyState = 0) & (this.FilterState = 1) & (await this.getWaitJoinOracleIDsRL(this.oracle_filter_IdStart, this.LimitsReturn));
    },
    getMyCreateWaitJoin() {
      (this.cfBtnNumber = 1) & (this.MyState = 201) & (this.FilterState = 1) & this.getMyOracleIDsRLByState(this.FilterState, this.MyState, this.oracle_filter_IdStart, this.LimitsReturn);
    },
    getMyCreateWaitAnneal() {
      (this.cfBtnNumber = 2) & (this.MyState = 201) & (this.FilterState = 2) & this.getMyOracleIDsRLByState(this.FilterState, this.MyState, this.oracle_filter_IdStart, this.LimitsReturn);
    },
    getMyJoinedWaitAnneal() {
      (this.cfBtnNumber = 3) & (this.MyState = 4) & (this.FilterState = 2) & this.getMyOracleIDsRLByState(this.FilterState, this.MyState, this.oracle_filter_IdStart, this.LimitsReturn);
    },
    /*
     *@Author: yozora
     *@Description: 查询可加入预言机
     *@Date: 2021-03-17 14:23:47
     */
    async getWaitJoinOracleIDsRL(_startID, _limit) {
      if (_startID == "") {
        _startID = 1;
      }
      this.myLogs = [];
      this.OracleDatas = [];
      let cacheOracleDatas = [];
      this.updateToastAndShow(`${this.filterButtonText[1][0]} Refresh`, `Please wait, fetching ${this.filterButtonText[1][0]} datas …… ……`);
      await this.NAPContract.methods
        .getWaitJoinOracleIDsRL(_startID, _limit)
        .call({ from: this.addressNow })
        .then(OracleIDRLs => {
          for (let i = 0; OracleIDRLs[0][i] != 0; i++) {
            this.NAPContract.methods
              .Oracles(OracleIDRLs[0][i])
              .call()
              .then(rst2 => {
                rst2.OracleID = OracleIDRLs[0][i];
                rst2.myUintInTheOracle = OracleIDRLs[1][i];
                cacheOracleDatas.push(rst2);
                cacheOracleDatas.forEach(item => console.log(item));
              });
          }
          this.updateToastAndShow(`${this.filterButtonText[1][0]}`, `Success: Oracle ID in range 【#${_startID}~#${Number(_startID) + Number(_limit) - 1}】——> Fetched ${this.filterButtonText[1][0]} datas.`);
        });
      // 可加入预言机
      this.OracleDatas = cacheOracleDatas;
      this.myLogs = cacheOracleDatas;
    },
    getMyOracleIDsRLByState(_state, _myState, _startID, _limit) {
      if (_startID == "") {
        _startID = 1;
      }
      this.OracleDatas = [];
      this.updateToastAndShow(`${this.filterButtonText[_state][_myState]} Refresh`, `Please wait, fetching ${this.filterButtonText[_state][_myState]} datas …… ……`);
      this.NAPContract.methods
        .getMyOracleIDsRLByState(_state, _startID, _limit)
        .call({ from: this.addressNow })
        .then(OracleIDRLs => {
          let cacheOracleDatas = [];

          if (_myState == 201) {
            //自己创建的（等待加入和等待退火的）
            // console.log('xx')
            for (let i = 0; OracleIDRLs[0][i] != 0; i++) {
              if (OracleIDRLs[1][i] == 201) {
                this.NAPContract.methods
                  .Oracles(OracleIDRLs[0][i])
                  .call()
                  .then(rst2 => {
                    if (_state == rst2.state) {
                      rst2.OracleID = OracleIDRLs[0][i];
                      rst2.myUintInTheOracle = OracleIDRLs[1][i];
                      cacheOracleDatas.push(rst2);
                    }
                  });
              }
            }
          } else if (_myState == 4) {
            //别人创建自己加入的（等待对方退火和处理过期的）
            for (let i = 0; OracleIDRLs[0][i] != 0; i++) {
              //只要返回的ID有效就继续处理
              if (OracleIDRLs[1][i] < 4 && OracleIDRLs[1][i] > 0) {
                //只要符合uint是gote就处理
                // console.log(i)
                this.NAPContract.methods
                  .Oracles(OracleIDRLs[0][i])
                  .call()
                  .then(rst2 => {
                    if (_state == rst2.state) {
                      rst2.OracleID = OracleIDRLs[0][i];
                      rst2.myUintInTheOracle = OracleIDRLs[1][i];
                      cacheOracleDatas.push(rst2);
                    }
                  });
              }
            }
          }

          this.OracleDatas = cacheOracleDatas;
          // console.log(cacheOracleDatas.length)
          this.updateToastAndShow(
            `${this.filterButtonText[_state][_myState]}`,
            `Success: Oracle ID in range 【#${_startID}~#${Number(_startID) + Number(_limit) - 1}】——> Fetched ${this.filterButtonText[_state][_myState]} datas.`
          );
        });
    },
    // 订阅方法
    subscribeCreate() {
      // 这得吵死
      this.NAPContract.events
        .newOracleCreateAndHashStgSet({ filter: {}, fromBlock: this.BlockNumber - 5000 }, function(error, event) {
          console.log(event);
        })
        .on("data", function(event) {
          this.dt = event;
          console.log(event); // same results as the optional callback above
        })
        .on("changed", function() {
          // remove event from local database
        })
        .on("error", console.error);
    },
    subscribeJoin(_oids) {
      // if(_oids.length == 0) _oids = [0];
      console.log("_oids", _oids);
      this.NAPContract.events
        .GoteJoinedAndRawStgSet({ filter: { OracleID: _oids }, fromBlock: this.BlockNumber - 4900 }, function(error, event) {
          this.dt = event;
          try {
            this.oracleJoinedTitle = `#${event.returnValues.OracleID} been joined: 【${this.fingers[parseInt(event.returnValues.Strategy_Raw)]}】 & 【${this.web3js.utils.fromWei(
              String(event.returnValues.GoteOracleBid),
              "ether"
            )} $NAP】`;
            this.oracleJoinedContent = `By 【${event.returnValues.Player}】.`;
            this.staticBackdropJoined = true;
          } catch (error) {
            console.log(event, "error", error);
          }
        })
        .on("data", function() {
          // console.log('.on(data',event); // same results as the optional callback above
        })
        .on("changed", function() {
          // remove event from local database
        })
        .on("error", console.error);
    },
    deleteSubscribeJoin(_oid) {
      try {
        this.LSWaitJoin.splice(this.LSWaitJoin.indexOf(parseInt(_oid)), 1);
        LocalData_WaitJoin.save(this.LSWaitJoin);
      } catch (error) {
        console.log("#", _oid, ": delete listen wait join error, may not listening", error);
      }
    },
    cWaitJoin() {
      this.LSWaitJoin = [];
      LocalData_WaitJoin.save(this.LSWaitJoin);
    },
    // init 方法
    getNetwork() {
      if (this.NAPContract == undefined) {
        this.networkId = parseInt(this.ethereum.chainId);
        this.switchNetwork(this.networkId);
        this.$store.commit("SET_NETWORK", this.netWork);
      } else {
        this.intervalRefresh();
        // -- set cyclicity refresh for update info
        self.setInterval("this.intervalRefresh()", 20000);
        clearInterval(this.getNetworkInterval);
      }
    },
    switchNetwork(networkId) {
      console.log("networkId:", networkId);
      switch (networkId) {
        case 1: //mainnet
          this.NAPAddress = "0x9FA1E566BBf36A45EA07a12580FBA09940665bd1";
          this.netWork = "Ethereum";
          this.updateToastAndShow("当前区块链未上线", `已上线BSC，请切换至BSC进行参与，或Kovan进行测试。`);
          clearInterval(this.getNetworkInterval);
          break;
        // this.initContractInstance()
        case 3: // ropsten
          this.NAPAddress = "0x39455E9271357179d92098f35895C4F0aF2D7602";
          this.netWork = "Ropsten";
          this.updateToastAndShow("当前区块链未上线", `已上线BSC，请切换至BSC进行参与，或Kovan进行测试。`);
          clearInterval(this.getNetworkInterval);
          break;
        // this.initContractInstance()
        case 4: // Rinkeby
          this.NAPAddress = "0x39455E9271357179d92098f35895C4F0aF2D7602";
          this.netWork = "Rinkeby";
          this.updateToastAndShow("当前区块链未上线", `已上线BSC，请切换至BSC进行参与，或Kovan进行测试。`);
          clearInterval(this.getNetworkInterval);
          break;
        // this.initContractInstance()
        case 42: //kovan
          this.NAPAddress = "0x0D54464EC49818BDaf6f42f465025A06CbD68ffD";
          this.LPAddress = "0xf00d166880f318cbf5fea6e3b6cd507ae37febe6";
          this.netWork = "Kovan";
          this.initContractInstance();
          break;
        case 56: //BSC
          this.NAPAddress = "0x4D05DE8D57b238457D62dAdd6D3B395Bbc8c9824";
          this.LPAddress = "0xc9a960dc0c04cde1c5729300892cb27eade5e4d0";
          this.netWork = "BSC";
          this.initContractInstance();
          break;
        case 97: //Bsc test
          this.NAPAddress = "0x39455E9271357179d92098f35895C4F0aF2D7602";
          // NAPAddress = "0x949b5948668D199B392FE8624130D47935D3b180";
          this.LPAddress = "0x8ec71e1568d707348c14ecadd64d145860184b8d";
          this.netWork = "BSCTest";
          this.updateToastAndShow("当前区块链未上线", `已上线BSC，请切换至BSC进行参与，或Kovan进行测试。`);
          clearInterval(this.getNetworkInterval);
          break;
        // this.initContractInstance()
        case 100: //xdai
          this.NAPAddress = "0x9FA1E566BBf36A45EA07a12580FBA09940665bd1";
          this.netWork = "xDAI";
          this.updateToastAndShow("当前区块链未上线", `已上线BSC，请切换至BSC进行参与，或Kovan进行测试。`);
          clearInterval(this.getNetworkInterval);
          break;
        // this.initContractInstance()
        case 1337: //tf
          this.NAPAddress = "0x39455E9271357179d92098f35895C4F0aF2D7602";
          this.netWork = "Truffle";
          this.initContractInstance();
          break;
        default:
          this.updateToastAndShow("当前区块链未上线", `已上线BSC，请切换至BSC进行参与，或Kovan进行测试。`);
          clearInterval(this.getNetworkInterval);
          break;
      }
    },
    initContractInstance() {
      // this.NAPAddress = NAPAddress;
      this.NAPContract = new this.web3js.eth.Contract(NAP_MVP_API, this.NAPAddress);
      this.LPContract = new this.web3js.eth.Contract(NAP_MVP_API, this.LPAddress);
      // document.body.removeChild(document.querySelector('#stars'))
      console.log(`NAPAddress@${this.netWork}`, this.NAPAddress);
      // 挂载好且网络检测好之后才读取ls
      this.LS_NetWork = this.netWork;
      this.LSCache = LocalData_Cache.fetch();
      this.LSSent = LocalData_Sent.fetch();
      this.LSWaitJoin = LocalData_WaitJoin.fetch();
      console.log(`LSWaitJoin:${this.LSWaitJoin}`);
      this.initUserData();
    },
    async initUserData() {
      await this.RefreshAccount();
      await this.intervalRefresh();
      await this.getJoinAbleOracles();
      await this.subscribeJoin(this.LSWaitJoin);
    },
    sleep(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    // 操作菜单
    callback(key) {
      if (key === "1") {
        // 加载大厅-可加入的
        this.activeKey = "1";
        this.getJoinAbleOracles();
      } else {
        // 加载全部卡片
        this.activeKey = "2";
        this.getAllLogs();
      }
    },
    /*
     *@Author: yozora
     *@Description: 产生随机数
     *@Date: 2021-03-15 11:40:15
     */
    randomNum() {
      this.diceSpin = true;
      setTimeout(() => {
        this.create_rawEntropy = Math.random();
        this.diceSpin = false;
      }, 2000);
    },
    // 操作卡片
    openCreateOracle() {
      this.staticBackdropCreateOracle = true;
    },
    closeCreateOracle() {
      this.staticBackdropCreateOracle = false;
    },
    closeJoinOracle() {
      this.staticBackdropJoinOracle = false;
    },
    closeJoinedOracle() {
      this.staticBackdropJoined = false;
    },
    closePending() {
      this.staticBackdropPending = false;
    },
    closeAnnealed() {
      this.staticBackdropAnnealed = false;
    },
    handleTabs() {},
    /*
     *@Author: yozora
     *@Description: 通知信息
     *@Date: 2021-03-14 15:14:32
     */
    openNotification() {
      const key = `open${Date.now()}`;
      notification.open({
        message: h => (
          <div class="toast-header">
            <img src={require("../assets/nash.png")} class="rounded mr-2" alt="NASH icon" style="width: 1rem;height: 1rem;" />
            <strong class="mr-auto" style="padding-right: 1rem;">
              {this.toastTitle}
            </strong>
            <small> @{this.timeNow}</small>
          </div>
        ),
        description: h => (
          <div class="toast-body" style="white-space: pre-line;">
            {this.toastContent}
          </div>
        ),
        style: {
          width: "420px",
          position: "absolute",
          right: "1rem",
        },
        btn: h => {
          return h(
            "a-button",
            {
              props: {
                type: "primary",
                size: "small",
              },
              on: {
                click: () => notification.close(key),
              },
            },
            "关闭"
          );
        },
        key,
      });
    },
    /*
     *@Author: yozora
     *@Description: 创建预言机交互metamask
     *@Date: 2021-03-15 11:39:55
     */
    handleCreateOracle() {
      const myDate = new Date();
      let timeNow = myDate.toLocaleDateString() + "-" + myDate.toLocaleTimeString();
      // 天时timeNow 地利guid() 人和oracle_create_rawEntropy
      let hsetp = this.web3js.utils.keccak256(timeNow + this.guid() + this.createRawEntropy);
      let stg = this.oracle_myStrategy;
      let bid = this.web3js.utils.toWei(String(this.create_bidFee.number));
      // 加密策略
      let EncryptedStg = this.encryption(hsetp, stg, bid);

      this.LSCache.push({ EncryptedStg, hsetp, stg, bid });
      LocalData_Cache.save(this.LSCache);

      // 弹出框
      this.staticBackdropPending = true;
      this.NAPContract.methods
        .createOracleAndSetHashStg(this.oracle_create_waitblocks, EncryptedStg)
        .send({
          from: this.addressNow,
          value: this.web3js.utils.toWei(String(this.create_joinfee.number)),
        })
        .then(rst => {
          this.dt = rst;
          console.log(`createOracle:${rst}`);
          let oid = parseInt(rst.events.newOracleCreateAndHashStgSet.returnValues.OracleID);
          // 记录发出的加密策略的原象
          this.LSSent[oid] = { hsetp, stg, bid };
          LocalData_Sent.save(this.LSSent);
          // 删除防止刷新丢失捕捉的加密策略原象
          this.LSCache.pop();
          LocalData_Cache.save(this.LSCache);
          //获取创建后等待gote的列表展示：创建后→展示自己创建可以取消的
          (this.cfBtnNumber = 1) &
            (oid - 9 < 0 ? (this.oracle_filter_IdStart = 0) : (this.oracle_filter_IdStart = oid - 9)) &
            (this.MyState = 201) &
            (this.FilterState = 1) &
            this.getMyOracleIDsRLByState(this.FilterState, this.MyState, this.oracle_filter_IdStart, this.LimitsReturn);

          // 弹出框
          this.staticBackdropPending = false;

          this.sleep(1000);
          // 记录等待加入的监听Oid
          this.LSWaitJoin.push(parseInt(oid));
          LocalData_WaitJoin.save(this.LSWaitJoin);
          this.subscribeJoin(this.LSWaitJoin);
        })
        .catch(e => {
          console.log(e);
          if (e.code === 4001) {
            this.staticBackdropPending = false;
            message.warning("你取消了支付", 2);
          }
        });
      this.confirmCreateOracle = false;
    },
    /*
     *@Author: yozora
     *@Description: 加入预言机交互metamask
     *@Date: 2021-03-17 23:08:45
     */
    handleJoinOracle() {
      let oid = this.joiningOracleID;
      this.updateToastAndShow("Join Oracle", `Pending:【#${oid}】Oracle Joining  …… ……`);
      this.staticBackdropPending = true;
      this.staticBackdropJoinOracle = false;
      this.NAPContract.methods
        .joinOracleAndSetGoteRawStg(oid, this.oracle_myStrategy, this.web3js.utils.toWei(String(this.oracle_joing_bidFee)))
        .send({
          from: this.addressNow,
          value: this.web3js.utils.toWei(String(this.oracle_join_joinfee)),
        })
        .then(rst => {
          console.log(`joinOracle:${rst}`);
          this.updateAlertInOracleCreate(
            false,
            `Success: 【#${oid}】Oracle joined. You can close this window and click button:【My joined, wait init to anneal】to see it. If the oracle expired you can finish it and direct win.`
          );
          this.updateToastAndShow("Join Oracle", `Success:Oracle joined.`);
          // 加入之后→刷新显示可以继续加入的，Filter OID保持不变
          (this.MyState = 0) & (this.FilterState = 1) & this.getWaitJoinOracleIDsRL(this.oracle_filter_IdStart, this.LimitsReturn);
          this.staticBackdropPending = false;
        })
        .catch(e => {
          console.log(e);
          if (e.code === 4001) {
            this.staticBackdropPending = false;
            message.warning("你取消了支付", 2);
          }
        });
      this.confirmJoinOracle = false;
    },
  },
};
</script>

<style scoped>

.neon:focus{
  background-color:rgba(242, 242, 242, 1);
}

.avatarIcon:hover{
  background-color:rgba(242, 242, 242, 1);
}

.strategy-icon {
    float: left;
    margin-top: -25px;
    margin-left: 20px;
    font-size: 24px;
    padding-bottom: 2px;
    background-color: #fff;
    border-radius: 50px;
}

.strategy-icon >>> .anticon {
  font-size: 32px;
  background-color: #fff;
  padding:5px;
  border: 2px solid  rgba(242, 242, 242, 1);
  border-radius: 50px;
}

.control-input.ant-input-group-wrapper >>> input{
  box-shadow: inset 2px 2px 5px #8f8787;
  background: rgba(242, 242, 242, 1);
  /* width: 50%; */
  /* float: right; */
  margin-right: 2em;
}

.strategy-input {
  box-shadow: inset 2px 2px 5px #8f8787;
  background: rgba(242, 242, 242, 1);
  width: 50%;
  float: right;
  margin-right: 2em;
}

.strategy-block{
  width: 70%;
  margin-top: 2em;
}

.strategy-input-bottom{
  box-shadow: inset 2px 2px 5px #8f8787;
  background: #fff);
  width: 50%;
  float: right;
  margin-right: 2em;
}

.strategy-input >>> .ant-input-affix-wrapper.ant-input:focus {
  border: none;
  background: #f6f6f6;
  outline: none;
  width: 95%;
  box-shadow: none;
}

.strategy-bottom >>> .ant-select-selection.ant-select-selection--single {
  background-color: rgba(242, 242, 242, 1);
}

.strategy-select >>> .ant-select-selection.ant-select-selection--single {
  border: none;
  box-shadow: none;
}

.strategy-tabs-input {
  box-shadow: inset 2px 2px 5px #8f8787;
  background: rgb(255, 255, 255);
  width: 50%;
  float: right;
  margin-right: 2em;
  margin-top: -3em;
}

.strategy-tabs >>> .ant-card.ant-card-bordered.ant-card-contain-grid.ant-card-small,.ant-card.ant-card-bordered.ant-card-small{
    border-radius: 10px;
    background-color: rgba(242, 242, 242, 1);
}

.strategy-tabs >>> .ant-card-grid.ant-card-grid-hoverable{
    width: 70%;
    text-align: center;
    margin-top: 2em;
    margin-left: 5em;
    padding: 1em;
    border-radius: 10px;
    background-color: rgb(255, 255, 255)
}

.strategy-tabs >>> .ant-card-meta-detail{
    margin-left: 5em;
    margin-top: -1px;
}

/* .strategy-tabs >>> .ant-tabs-tab.ant-tabs-tab-disabled{
  background-color:rgba(242, 242, 242, 1);
} */

.strategy-tabs >>> .ant-card-meta-avatar{
    margin-right: 5em;
    margin-top: -1px;
}

.strategy-tabs-icon{
    padding: 1em 1em 1em 3em;
    background-color: rgba(242, 242, 242, 1);
    float: left;
    margin-left: 2em;
    border-radius: 10px;
}

.strategy-tabs-div-left{
    float: left;
    margin-left: 5em;
}

.strategy-tabs-div-right{
    float: right;
    margin-right: 5em;
}

.neon {
    color: #cce7f8;
    font-size: 0.5rem;
    font-family: 'Pacifico';
    text-transform: uppercase;
}

.bg-card.padding-box >>> .ant-divider.ant-divider-vertical{
    height: 2em;
    margin: 2em;
}

.card-shadow{
    box-shadow: 2px 2px 5px 5px #8f8787;
  border-radius: 10px;
}

.card-body >>>  .ant-card-meta-avatar{
  float: right;
}

.card-body >>> .ant-tabs-bar.ant-tabs-top-bar{
  text-align:left;
}

.card-body >>> .ant-btn:focus {
  color: #fff
}

.ant-carousel >>> .slick-slide {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel >>> .slick-slide h3,.slick-slide h6 {
  color: #fff;
}
</style>
