<template>
  <div id="play" style="width: 100%;">
    <!-- <star></star> -->
    <br />
    <!-- 游戏区域 -->
    <div v-if="NAPContract == undefined"></div>
    <div v-else>
      <div class="row">
        <div class="col-8" style="min-width: 13rem;margin:auto">
          <aside>
            <div class="card bg-log">
              <particles-bg style="position: absolute;zIndex: 0; top: 0;left: 0" num="6" type="cobweb" />
              <div class="card-body">
                <!-- 散点图 -->
                <Charts :historyLogs="historyLogs" :chartTitle="chartTitle" style="height: 300px"></Charts>
                <!-- 菜单tab -->
                <div style="text-align: left">
                  <a-dropdown>
                    <!-- 切换菜单 -->
                    <a-tag color="purple" @click="e => e.preventDefault()"> 切换菜单 <a-icon type="down" style="transform: translate(0px, -3px);" class="log-icon" /> </a-tag>
                    <a-menu slot="overlay" @click="handleTabs">
                      <a-menu-item key="1"> <a-icon type="compass" />卡片列表 </a-menu-item>
                      <a-menu-item key="2"> <a-icon type="compass" />最近日志 </a-menu-item>
                      <a-menu-item disabled>
                        <a-icon type="compass" style="transform: translate(0px, -3px);" />OracleID Filter: #
                        <a-input style="width: 30%" type="number" placeholder="OracleID >= (default is 1)" v-model="oracle_filter_IdStart" step="10"> </a-input>
                        <span> ~ #{{ parseInt(oracle_filter_IdStart) + 9 }}</span></a-menu-item
                      >
                    </a-menu>
                  </a-dropdown>
                </div>
                <a-tabs :activeKey="activeKey" @change="callback" class="strategy-tabs" animated>
                  <!-- 大厅 -->
                  <a-tab-pane v-if="tabMode === 1" key="0" disabled>
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
                              <span style="font-weight: bold">#{{ oracleData.OracleID }}</span>
                            </template>
                            <template slot="avatar">
                              <icon-font type="icon-goldcup" class="log-icon"></icon-font><span>{{ web3js.utils.fromWei(String(oracleData.joinFee), "ether") }}${{ coinName[netWork] }}</span>
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
                            <span>等待加入...</span>
                          </a-card-grid>
                          <a-divider style="opacity:0"></a-divider>
                          <div class="strategy-tabs-div-left">
                            <a-icon type="block" class="log-icon" /><span>{{ oracleData.markBlock }}</span>
                          </div>
                          <div class="strategy-tabs-div-right">
                            <a-icon type="hourglass" class="log-icon" /><span>{{ oracleData.waitBlocks }}</span>
                          </div>
                          <a-divider style="opacity:0"></a-divider>
                          <div style="margin-bottom: 1em">
                            <a-button style="width: 70%;" type="primary" @click="handleJoinOracleCard(oracleData)">加入对局</a-button>
                          </div>
                        </a-card>
                        <!-- 可加入的卡片步骤二 -->
                        <a-card size="small" v-show="joiningOracleID === oracleData.OracleID">
                          <a-card-meta style="text-align:left;font-weight: bold;margin-top: 10px">
                            <template slot="title">
                              <a-icon type="arrow-left" class="log-icon" @click="joiningOracleID = ''" />
                            </template>
                            <template slot="avatar">
                              <icon-font type="icon-goldcup" class="log-icon"></icon-font><span>{{ web3js.utils.fromWei(String(oracleData.joinFee), "ether") }}${{ coinName[netWork] }}</span>
                            </template>
                          </a-card-meta>
                          <a-divider style="margin:12px 0"></a-divider>
                          <!-- 支付区 -->
                          <a-card-grid style="background-color: rgba(242, 242, 242, 1);">
                            <div>
                              <p style="text-align: left;">你 支付</p>
                              <p style="text-align: left;">NAP</p>
                              <a-input size="large" class="strategy-tabs-input" type="number" v-model="oracle_joing_bidFee"> </a-input>
                            </div>
                          </a-card-grid>
                          <!-- 策略区 -->
                          <a-card-grid style="background-color: rgba(242, 242, 242, 1);">
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
                            <!-- <a-divider style="opacity:0"></a-divider> -->
                            <small style="text-align: center;display: block;margin: 15px 0;">
                              【{{ oracle_joing_bidFee / (web3js.utils.fromWei(String(oracleData.joinFee), "ether") * 0.95) }} $NAP/${{ coinName[netWork] }}】
                            </small>
                            <div><a-button style="width: 100%;" type="primary" @click="joinOracleAndSetGoteRawStg(oracleData)">提交报价</a-button></div>
                          </a-card-grid>
                        </a-card>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 我创建的 -->
                  <a-tab-pane v-if="tabMode === 1" key="-1" disabled>
                    <a-tag slot="tab" color="purple">
                      <a-icon type="reconciliation" style="font-size: 16px;vertical-align: -50%;" />
                      我创建的 >>>
                    </a-tag>
                  </a-tab-pane>
                  <!-- 等待加入 -->
                  <a-tab-pane v-if="tabMode === 1" key="2" tab="等待加入" force-render>
                    <a-list :grid="{ gutter: 16, column: 2 }" :data-source="myLogs" v-if="activeKey === '2'">
                      <a-list-item slot="renderItem" slot-scope="oracleData, index">
                        <!-- 等待加入卡片 -->
                        <a-card size="small">
                          <a-card-meta style="text-align:left;font-weight: bold;margin-top: 10px">
                            <template slot="title">
                              <span style="font-weight: bold">#{{ oracleData.OracleID }}</span>
                            </template>
                            <template slot="avatar">
                              <icon-font type="icon-goldcup" class="log-icon"></icon-font><span>{{ web3js.utils.fromWei(String(oracleData.joinFee), "ether") }}${{ coinName[netWork] }}</span>
                            </template>
                          </a-card-meta>
                          <a-divider style="margin:12px 0"></a-divider>
                          <a-card-grid>
                            <div>
                              <a-tag style="float:left;margin-top:1em;margin-left:-0.5em" color="pink">你</a-tag>
                              <div class="strategy-tabs-icon-you">
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
                            <span>等待加入...</span>
                          </a-card-grid>
                          <a-divider style="opacity:0"></a-divider>
                          <div class="strategy-tabs-div-left">
                            <a-icon type="block" class="log-icon" /><span>{{ oracleData.markBlock }}</span>
                          </div>
                          <div class="strategy-tabs-div-right">
                            <a-icon type="hourglass" class="log-icon" /><span>{{ oracleData.waitBlocks }}</span>
                          </div>
                          <a-divider style="opacity:0"></a-divider>
                          <div style="margin-bottom: 1em">
                            <a-button style="width: 70%;" type="primary" @click="cancelButtonClick(oracleData)">取消</a-button>
                          </div>
                        </a-card>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 等待仲裁 -->
                  <a-tab-pane v-if="tabMode === 1" key="3" tab="等待仲裁">
                    <a-list :grid="{ gutter: 16, column: 2 }" :data-source="myLogs" v-if="activeKey === '3'">
                      <a-list-item slot="renderItem" slot-scope="oracleData, index">
                        <!-- 等待仲裁卡片 -->
                        <a-card size="small">
                          <a-card-meta style="text-align:left;font-weight: bold;margin-top: 10px">
                            <template slot="title">
                              <span style="font-weight: bold">#{{ oracleData.OracleID }}</span>
                            </template>
                            <template slot="avatar">
                              <icon-font type="icon-goldcup" class="log-icon"></icon-font><span>{{ web3js.utils.fromWei(String(oracleData.joinFee), "ether") }}${{ coinName[netWork] }}</span>
                            </template>
                          </a-card-meta>
                          <a-divider style="margin:12px 0"></a-divider>
                          <a-card-grid>
                            <div>
                              <a-tag style="float:left;margin-top:1em;margin-left:-0.5em" color="pink">你</a-tag>
                              <div class="strategy-tabs-icon-you">
                                <a-icon type="check" :style="{ transform: 'translate(-100%, -30%)' }" />
                              </div>
                              <span>**** NAP</span>
                            </div>
                            <div>
                              <span>**** BNB/NAP</span>
                            </div>
                          </a-card-grid>
                          <a-card-grid>
                            <div>
                              <div class="strategy-tabs-icon" style="width:26%">
                                <div style="margin-left: -2.2em;">
                                  <span style="font-size: 16px">
                                    {{ fingers[oracleData.myUintInTheOracle] }}
                                  </span>
                                </div>
                              </div>
                              <span>**** NAP</span>
                            </div>
                            <div>
                              <span>**** BNB/NAP</span>
                            </div>
                          </a-card-grid>
                          <a-divider style="opacity:0"></a-divider>
                          <div class="strategy-tabs-div-left">
                            <a-icon type="block" class="log-icon" /><span>{{ oracleData.markBlock }}</span>
                          </div>
                          <div class="strategy-tabs-div-right">
                            <a-icon type="hourglass" class="log-icon" /><span>{{ oracleData.waitBlocks }}</span>
                          </div>
                          <a-divider style="opacity:0"></a-divider>
                          <div style="margin-bottom: 1em">
                            <a-button style="width: 70%;" type="primary" @click="annealButtonClick(oracleData)">仲裁</a-button>
                          </div>
                        </a-card>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 我加入的 -->
                  <a-tab-pane v-if="tabMode === 1" key="-2" disabled>
                    <a-tag slot="tab" color="purple">
                      <a-icon type="reconciliation" style="font-size: 16px;vertical-align: -50%;" />
                      我加入的 >>>
                    </a-tag>
                  </a-tab-pane>
                  <!-- 等待仲裁 -->
                  <a-tab-pane v-if="tabMode === 1" key="4" tab="等待仲裁">
                    <a-list :grid="{ gutter: 16, column: 2 }" :data-source="myLogs" v-if="activeKey === '4'">
                      <a-list-item slot="renderItem" slot-scope="oracleData, index">
                        <!-- 等待仲裁结果卡片 -->
                        <a-card size="small">
                          <a-card-meta style="text-align:left;font-weight: bold;margin-top: 10px">
                            <template slot="title">
                              <span style="font-weight: bold">#{{ oracleData.OracleID }}</span>
                            </template>
                            <template slot="avatar">
                              <icon-font type="icon-goldcup" class="log-icon"></icon-font><span>{{ web3js.utils.fromWei(String(oracleData.joinFee), "ether") }}${{ coinName[netWork] }}</span>
                            </template>
                          </a-card-meta>
                          <a-divider style="margin:12px 0"></a-divider>
                          <a-card-grid>
                            <div>
                              <div class="strategy-tabs-icon">
                                <div>
                                  <a-icon type="check" :style="{ transform: 'translate(-100%, -30%)' }" />
                                </div>
                              </div>
                              <span>**** NAP</span>
                            </div>
                            <div>
                              <span>**** BNB/NAP</span>
                            </div>
                          </a-card-grid>
                          <a-card-grid>
                            <div>
                              <a-tag style="float:left;margin-top:1em;margin-left:-0.5em" color="pink">你</a-tag>
                              <div class="strategy-tabs-icon-you" style="width: 25%;margin-left: -0.1em;">
                                <div style="margin-left: -2.2em;">
                                  <span style="font-size: 16px">
                                    {{ fingers[oracleData.myUintInTheOracle] }}
                                  </span>
                                </div>
                              </div>
                              <span>**** NAP</span>
                            </div>
                            <div>
                              <span>**** BNB/NAP</span>
                            </div>
                          </a-card-grid>
                          <a-divider style="opacity:0"></a-divider>
                          <div class="strategy-tabs-div-left">
                            <a-icon type="block" class="log-icon" /><span>{{ oracleData.markBlock }}</span>
                          </div>
                          <div class="strategy-tabs-div-right">
                            <a-icon type="hourglass" class="log-icon" /><span>{{ oracleData.waitBlocks }}</span>
                          </div>
                          <a-divider style="opacity:0"></a-divider>
                          <div style="margin-bottom: 1em">
                            <a-button style="width: 70%;color: rgba(0, 0, 0, 0.65);" disabled>等待仲裁<icon-font type="icon-shalou" :style="{ transform: 'translate(0, -20%)' }" spin></icon-font></a-button>
                          </div>
                        </a-card>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- *********************************切换菜单*********************************** -->
                  <!-- 我的 -->
                  <a-tab-pane v-if="tabMode === 2" key="-3" disabled>
                    <a-tag slot="tab" color="purple">
                      <a-icon type="reconciliation" style="font-size: 16px;vertical-align: -50%;" />
                      我的 >>>
                    </a-tag>
                  </a-tab-pane>
                  <!-- 我创建的日志 -->
                  <a-tab-pane v-if="tabMode === 2" key="5" tab="我创建的">
                    <a-list bordered style="text-align: left" item-layout="horizontal" :data-source="OracleLogs" v-if="activeKey === '5'">
                      <a-list-item slot="renderItem" slot-scope="oracleLog, index">
                        <a-list-item-meta>
                          <h3 slot="title">#{{ oracleLog.returnValues.OracleID }}</h3>
                          <div slot="description">
                            <!-- <p><a-icon type="user-add" class="log-icon" />Creator: {{ oracleLog.returnValues.Creater }}</p> -->
                            <p><icon-font type="icon-bitcoin-encryption" class="log-icon" />JoinFee: {{ web3js.utils.fromWei(String(oracleLog.returnValues.JoinFee), "ether") }}${{ coinName[netWork] }}</p>
                            <p><a-icon type="block" class="log-icon" />WaitBlocks: {{ oracleLog.returnValues.WaitBlocks }}</p>
                            <p><a-icon type="bulb" class="log-icon" />strategyHash: {{ oracleLog.returnValues.stgHash }}</p>
                          </div>
                        </a-list-item-meta>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 我加入的日志 -->
                  <a-tab-pane v-if="tabMode === 2" key="6" tab="我加入的">
                    <a-list bordered style="text-align: left" item-layout="horizontal" :data-source="OracleLogs" v-if="activeKey === '6'">
                      <a-list-item slot="renderItem" slot-scope="oracleLog, index">
                        <a-list-item-meta>
                          <h3 slot="title">#{{ oracleLog.returnValues.OracleID }}</h3>
                          <div slot="description">
                            <p><a-icon type="block" class="log-icon" />BlockNumber: {{ oracleLog.blockNumber }}</p>
                            <!-- <p><a-icon type="user-add" class="log-icon" />You Address : {{ oracleLog.returnValues.Player }}</p> -->
                            <p><icon-font type="icon-bitcoin-encryption" class="log-icon" />You Bid: {{ web3js.utils.fromWei(String(oracleLog.returnValues.GoteOracleBid), "ether") }}NAP</p>
                            <p><a-icon type="bulb" class="log-icon" />You strategy: {{ fingers[oracleLog.returnValues.Strategy_Raw] }}</p>
                          </div>
                        </a-list-item-meta>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 我获胜的日志 -->
                  <a-tab-pane v-if="tabMode === 2" key="7" tab="我获胜的">
                    <a-list bordered style="text-align: left" item-layout="horizontal" :data-source="OracleLogs" v-if="activeKey === '7'">
                      <a-list-item slot="renderItem" slot-scope="oracleLog, index">
                        <a-list-item-meta>
                          <h3 slot="title">#{{ oracleLog.returnValues.OracleID }}</h3>
                          <div slot="description">
                            <p><icon-font type="icon-xiqingfenweiqingzhulihua" class="log-icon" />Congratulations You Win!</p>
                            <p><icon-font type="icon-goldcup" class="log-icon" />Reward: {{ web3js.utils.fromWei(String(oracleLog.returnValues.Prize), "ether") }}${{ coinName[netWork] }}</p>
                            <p><a-icon type="block" class="log-icon" />Creator strategy: {{ fingers[oracleLog.returnValues.Strategy_Init] }}</p>
                            <p><a-icon type="bulb" class="log-icon" />Challenger strategy: {{ fingers[oracleLog.returnValues.Strategy_Gote] }}</p>
                            <p>
                              <icon-font type="icon-bitcoin-encryption" class="log-icon" />OraclePrice:
                              {{ parseFloat(String((2 * oracleLog.returnValues.ValidBid) / oracleLog.returnValues.Prize)).toLocaleString() }}$NAP/${{ coinName[netWork] }}
                            </p>
                            <!-- <p><a-icon type="profile" class="log-icon" />OverReason: {{ oracle_overReason[oracleLog.returnValues.Reason] }}</p> -->
                          </div>
                        </a-list-item-meta>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 全部 -->
                  <a-tab-pane v-if="tabMode === 2" key="-4" disabled>
                    <a-tag slot="tab" color="purple">
                      <a-icon type="reconciliation" style="font-size: 16px;vertical-align: -50%;" />
                      全部 >>>
                    </a-tag>
                  </a-tab-pane>
                  <!-- 最近创建日志 -->
                  <a-tab-pane v-if="tabMode === 2" key="8" tab="最近创建的">
                    <a-list bordered style="text-align: left" item-layout="horizontal" :data-source="OracleLogs" v-if="activeKey === '8'">
                      <a-list-item slot="renderItem" slot-scope="oracleLog, index">
                        <a-list-item-meta>
                          <h3 slot="title">#{{ oracleLog.returnValues.OracleID }}</h3>
                          <div slot="description">
                            <p><a-icon type="user-add" class="log-icon" />Creator: {{ oracleLog.returnValues.Creater }}</p>
                            <p><icon-font type="icon-bitcoin-encryption" class="log-icon" />JoinFee: {{ web3js.utils.fromWei(String(oracleLog.returnValues.JoinFee), "ether") }}${{ coinName[netWork] }}</p>
                            <p><a-icon type="block" class="log-icon" />WaitBlocks: {{ oracleLog.returnValues.WaitBlocks }}</p>
                            <p><a-icon type="bulb" class="log-icon" />strategyHash: {{ oracleLog.returnValues.stgHash }}</p>
                          </div>
                        </a-list-item-meta>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 最近加入日志 -->
                  <a-tab-pane v-if="tabMode === 2" key="9" tab="最近加入的">
                    <a-list bordered style="text-align: left" item-layout="horizontal" :data-source="OracleLogs" v-if="activeKey === '9'">
                      <a-list-item slot="renderItem" slot-scope="oracleLog, index">
                        <a-list-item-meta>
                          <h3 slot="title">#{{ oracleLog.returnValues.OracleID }}</h3>
                          <div slot="description">
                            <p><a-icon type="block" class="log-icon" />BlockNumber: {{ oracleLog.blockNumber }}</p>
                            <!-- <p><a-icon type="user-add" class="log-icon" />You Address : {{ oracleLog.returnValues.Player }}</p> -->
                            <p><icon-font type="icon-bitcoin-encryption" class="log-icon" />You Bid: {{ web3js.utils.fromWei(String(oracleLog.returnValues.GoteOracleBid), "ether") }}NAP</p>
                            <p><a-icon type="bulb" class="log-icon" />You strategy: {{ fingers[oracleLog.returnValues.Strategy_Raw] }}</p>
                          </div>
                        </a-list-item-meta>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 最近结束日志 -->
                  <a-tab-pane bordered style="text-align: left" v-if="tabMode === 2" key="10" tab="最近结束的">
                    <a-list item-layout="horizontal" :data-source="OracleLogs" v-if="activeKey === '10'">
                      <a-list-item slot="renderItem" slot-scope="oracleLog, index">
                        <a-list-item-meta>
                          <h3 slot="title">#{{ oracleLog.returnValues.OracleID }}</h3>
                          <div slot="description">
                            <p><a-icon type="user-add" class="log-icon" />Winner: {{ oracleLog.returnValues.Winner }}</p>
                            <p><icon-font type="icon-goldcup" class="log-icon" />Reward: {{ web3js.utils.fromWei(String(oracleLog.returnValues.Prize), "ether") }}${{ coinName[netWork] }}</p>
                            <p><a-icon type="block" class="log-icon" />Creator strategy: {{ fingers[oracleLog.returnValues.Strategy_Init] }}</p>
                            <p><a-icon type="bulb" class="log-icon" />Challenger strategy: {{ fingers[oracleLog.returnValues.Strategy_Gote] }}</p>
                            <p>
                              <icon-font type="icon-bitcoin-encryption" class="log-icon" />OraclePrice:
                              {{ parseFloat(String((2 * oracleLog.returnValues.ValidBid) / oracleLog.returnValues.Prize)).toLocaleString() }}$NAP/${{ coinName[netWork] }}
                            </p>
                            <p><a-icon type="profile" class="log-icon" />OverReason: {{ oracle_overReason[oracleLog.returnValues.Reason] }}</p>
                          </div>
                        </a-list-item-meta>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                  <!-- 最近取消日志 -->
                  <a-tab-pane bordered style="text-align: left" v-if="tabMode === 2" key="11" tab="最近取消的">
                    <a-list item-layout="horizontal" :data-source="OracleLogs" v-if="activeKey === '11'">
                      <a-list-item slot="renderItem" slot-scope="oracleLog, index">
                        <a-list-item-meta>
                          <h3 slot="title">#{{ oracleLog.returnValues.OracleID }}</h3>
                          <div slot="description">
                            <p><a-icon type="user-add" class="log-icon" />Creator: {{ oracleLog.returnValues.CreaterAndCanceler }}</p>
                          </div>
                        </a-list-item-meta>
                      </a-list-item>
                    </a-list>
                  </a-tab-pane>
                </a-tabs>
                <!-- 卡片列表 -->
              </div>
            </div>
          </aside>
        </div>
        <!-- *********************************预言机面板及广告位*********************************** -->
        <!-- 预言机面板 -->
        <div class="col-4" style="min-width: 14rem;margin:auto">
          <div class="container">
            <div class="card bg-oracle" style="min-height: 20rem;overflow: auto;">
              <particles-bg style="position: absolute;zIndex: 0; top: 0;left: 0" num="6" type="cobweb" />
              <div class="card-body">
                <!-- 创建预言机面板一 -->
                <div class="card-shadow flipper" style="display:inline-block;width: 100%;">
                  <a-card class="re-item-front" :bordered="false" size="small" v-show="cardMode === 1">
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
                          <a-select-option v-for="item in ['NAP']" :key="item" :value="item">{{ item }}</a-select-option>
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
                  <a-card class="re-item-back" :bordered="false" size="small" v-show="cardMode === 1">
                    <a-card-meta style="text-align:left;font-weight: bold">
                      <template slot="title"> <a-icon style="transform: translate(0px, -3px);margin-right:20px" type="arrow-left" class="log-icon" @click="flipCard" /><span>随机数祈福</span> </template>
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
                        <icon-font @click="randomNum" slot="addonAfter" type="icon-Dice" :style="diceStyle" :spin="diceSpin" />
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
                        在等待时长结束前未完成仲裁，则您会被自动判负
                      </p>
                      <p style="text-align: left;margin-left: 10px;">仲裁速度越快，越容易获得注意</p>
                      <br />
                      <a-input placeholder="区块个数(默认4000)" class="control-input" type="text" v-model="oracle_create_waitblocks">
                        <span slot="addonAfter">约{{ oracle_create_waitTime }}分钟</span>
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
              <!-- <a-divider></a-divider> -->
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
                      <span>{{ napsUnclaimF }} NAP</span
                      ><a-button
                        style="border: 0;
                        background: gray;
                        margin-left: 5em;"
                        type="primary"
                        @click="claimNAP()"
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
                  <a-carousel effect="fade" autoplay :dots="false">
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
    </div>

    <!-- 等待卡片 -->
    <a-modal :visible="staticBackdropPending" :footer="null" :closable="false" centered id="staticBackdropPending" class="modal-a">
      <div>
        <div>
          <div class="modal-header">
            <h5 v-if="isPending" class="modal-title" id="staticBackdropLabel">
              Do not refuse! If you sent the transaction.
            </h5>
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
    <a-modal :visible="staticBackdropAnnealed" :footer="null" :closable="false" centered id="staticBackdropAnnealed" class="modal-a">
      <div>
        <div>
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">🎊 {{ oracleOverContent.OracleID }} Oracle Annealed!</h5>
            <button type="button" class="close" @click="closeAnnealed">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>{{ oracleOverContent.Result }}</p>
            <p>{{ oracleOverContent.Reward }}</p>
            <p>{{ oracleOverContent.Creator_strategy }}</p>
            <p>{{ oracleOverContent.Challenger_strategy }}</p>
            <p>{{ oracleOverContent.OraclePrice }}</p>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </a-modal>
    <!-- 加入卡片 -->
    <a-modal :visible="staticBackdropJoined" :footer="null" :closable="false" centered id="staticBackdropJoined" class="modal-a">
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
    <a-modal :visible="confirmCreateOracle" title="确认创建信息" @ok="handleCreateOracle">
      <p>waitBlock： 【{{ oracle_create_waitblocks }}】</p>
      <p>JoinFee： 【{{ create_joinfee.number }}】 {{ coinName[netWork] }}</p>
      <p>BidFee: 【{{ create_bidFee.number }}】 $NAP for 95% JoinFee</p>
      <p>EntropyRaw: 【{{ create_rawEntropy }}】</p>
      <p>Strategy: 【{{ fingers[oracle_myStrategy] }}】</p>
    </a-modal>
    <!-- 加入提示卡片 -->
    <a-modal :visible="confirmJoinOracle" title="确认加入信息" @ok="handleJoinOracle">
      <p>waitBlock： 【{{ joiningOracleWaitBlock }}】</p>
      <p>JoinFee： 【{{ oracle_join_joinfee }}】 {{ coinName[netWork] }}</p>
      <p>BidFee: 【{{ oracle_joing_bidFee }}】 $NAP for 95% JoinFee</p>
      <p>Strategy: 【{{ fingers[oracle_myStrategy] }}】</p>
    </a-modal>
  </div>
</template>

<script>
import { ParticlesBg } from "particles-bg-vue";
import { notification, message } from "ant-design-vue";
import Web3 from "web3";
import { LocalData, LocalData_Cache, LocalData_Sent, LocalData_WaitJoin, myDate } from "../util/StorageUtils.js";
import NAP_MVP_API from "../util/API_NAP_MVP.js";
import Charts from "../components/Charts.vue";
import { IconFont } from "../icons/my-icon.js";
import MyCanvas from "../components/My-Canvas.vue";

export default {
  components: {
    ParticlesBg,
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
      ethereum: null,
      web3js: null,
      addressNow: "0x0000000000000000000000000000000000000000",
      LSCache: "",
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
      isPending: true,
      oracle_filter_joinfee: "",
      oracle_filter_waitblocks: "",
      oracle_filter_IdStart: LocalData.fetch()[0] == undefined ? 1 : LocalData.fetch()[0],
      oracle_create_joinfee: "",
      oracle_create_waitTime: "",
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
      oracle_overReason: {
        0: "Creator Win",
        1: "Challenger Win",
        2: "CriticalAnnealed",
        3: "Expired Oracle",
      },

      /// oracle logs
      logsType: 0,
      historyLogs: [
        [0, 8.04],
        [1, 6.95],
        [2, 7.58],
        [6, 8.81],
        [8, 8.8],
        [10, 8.71],
        [10, 8.7],
        [10, 8.69],
        [10, 8.68],
        [10, 8.67],
        [10, 8.66],
        [10, 8.65],
        [10, 8.64],
        [10, 8.63],
        [12, 8.62],
        [12, 8.62],
        [13, 8.62],
        [14, 8.62],
        [14, 8.62],
        [15, 8.62],
        [15, 8.33],
        [16, 7.66],
        [16, 6.81],
        [18, 6.33],
        [18, 8.96],
        [19, 6.82],
        [19, 7.2],
        [20, 7.2],
        [20, 4.23],
        [21, 7.83],
        [21, 4.47],
        [22, 3.33],
        [22, 4.96],
        [23, 7.24],
        [23, 6.26],
        [0, 8.84],
        [0, 5.82],
        [18, 5.68],
      ],
      myLogs: [],
      /// dialogs
      oracleOverContent: {},
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
      diceStyle: { "font-size": "24px" },
      chartTitle: [],
      // create data new
      tokens: [],
      // 创建数据
      create_joinfee: {
        unit: "",
        number: 0,
      },
      create_bidFee: {
        unit: "NAP",
        number: 0,
      },
      create_rawEntropy: "",
      // 加入数据
      joiningOracleID: "",
      joiningOracleCreateAt: "",
      joiningOracleWaitBlock: "",
      oracle_joing_bidFee: "",
      oracle_join_joinfee: "",
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
    oracle_create_waitblocks: {
      handler: function(oracle_create_waitblocks) {
        if (this.netWork === "Kovan") {
          this.oracle_create_waitTime = Math.round((oracle_create_waitblocks * 8) / 60);
        }
        if (this.netWork === "BSC") {
          this.oracle_create_waitTime = Math.round((oracle_create_waitblocks * 3) / 60);
        }
      },
    },
  },
  created() {
    this.ethereum = window.ethereum;
    this.web3js = new Web3(window.ethereum);
    this.ethereum.request({ method: "eth_requestAccounts" }).then(res => {
      console.log(`Now account:${res[0]}`);
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
  methods: {
    // 1 数据处理方法
    _formatBigNumber(_bn) {
      return parseFloat(this.web3js.utils.fromWei(_bn, "ether")).toLocaleString();
    },
    /*
     *@Author: yozora
     *@Description: 通知卡片
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
      const allLogs = (
        await this.NAPContract.getPastEvents("allEvents", {
          filter: {},
          fromBlock: this.BlockNumber - 49000,
        })
      ).reverse();
      this.dt = allLogs.filter(item => {
        return item.event === "newOracleCreateAndHashStgSet" || item.event === "GoteJoinedAndRawStgSet" || item.event === "OracleOver";
      });
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
      console.log(this.dt);
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
      console.log(this.dt);
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
      console.log(this.dt);
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
      console.log(this.dt);
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
      this.OracleLogs = [];
      this.logsType = 5;
      this.dt = (
        await this.NAPContract.getPastEvents("GoteJoinedAndRawStgSet", {
          filter: {},
          fromBlock: this.BlockNumber - 4900,
        })
      ).reverse();
      this.OracleLogs = this.dt;
      console.log(this.dt);
      this.updateToastAndShow("All Oracle logs", `Fetched ${this.dt.length} Recently Joined logs.`);
    },
    /*
     *@Author: yozora
     *@Description: 获取最近结束日志
     *@Date: 2021-03-14 15:20:43
     */
    async getReOvLogs() {
      this.OracleLogs = [];
      this.logsType = 6;
      this.dt = (
        await this.NAPContract.getPastEvents("OracleOver", {
          filter: {},
          fromBlock: this.BlockNumber - 4900,
        })
      ).reverse();
      this.OracleLogs = this.dt;
      console.log(this.dt);
      this.updateToastAndShow("All Oracle logs", `Fetched ${this.dt.length} Recently over logs.`);
    },
    /*
     *@Author: yozora
     *@Description: 获取最近取消日志
     *@Date: 2021-03-15 19:12:23
     */
    async getReCcd() {
      this.OracleLogs = [];
      this.logsType = 7;
      this.dt = (
        await this.NAPContract.getPastEvents("OracleCanceled", {
          filter: {},
          fromBlock: this.BlockNumber - 4900,
        })
      ).reverse();
      this.OracleLogs = this.dt;
      console.log(this.dt);
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
      await this.NAPContract.methods.PCO_claimNAP().send({ from: this.addressNow });
      this.updateToastAndShow("Claim $NAPs", `Success: Claimed ${this.napsUnclaimF} $NAPs to wallet.`);
      await this.getMyUnclaimNAP();
      await this.getMyNAPsInWallet();
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
      // 卡片翻转
      document.getElementsByClassName("re-item-front")[0].classList.toggle("flip");
      document.getElementsByClassName("re-item-back")[0].classList.toggle("flip");
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
      return this.web3js.utils.keccak256(this.web3js.eth.abi.encodeParameters(["string", "uint256", "uint256"], [hsetp, stg, bid]));
    },
    /*
     *@Author: yozora
     *@Description: 取消创建预言机
     *@Date: 2021-03-15 20:59:00
     */
    cancelButtonClick(oracleData) {
      let oid = parseInt(oracleData.OracleID);
      this.staticBackdropPending = true;
      this.updateToastAndShow(`Cancel Oracle`, `Pending: Oracle【#${oid}】 Cancel  …… ……`);
      this.NAPContract.methods
        .cancelOracle(oid)
        .send({ from: this.addressNow })
        .then(rst => {
          this.updateToastAndShow("Cancel Oracle", `Success:【#${oid}】Oracle Canceled.`);
          this.getMyCreateWaitJoin();
          // 删除sent 策略释放空间
          if (rst.events.OracleCanceled.transactionHash) {
            delete this.LSSent[oid];
            LocalData_Sent.save(this.LSSent, this.LS_NetWork);
          }
          // 删除监听
          this.deleteSubscribeJoin(oid);
          this.staticBackdropPending = false;
        })
        .catch(e => {
          console.error(e);
          this.staticBackdropPending = false;
        });
    },
    /*
      ? Deprecated
     */
    joinButtonClick(oracleData) {},
    /*
     *@Author: yozora
     *@Description: 加入预言机
     *@Date: 2021-03-17 22:48:11
     */
    joinOracleAndSetGoteRawStg(oracleData) {
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
      this.joiningOracleWaitBlock = oracleData.waitBlocks;

      // 更新加入信息
      this.oracle_join_joinfee = this.web3js.utils.fromWei(oracleData.joinFee, "ether");
      this.joiningOracleID = oracleData.OracleID;
      this.confirmJoinOracle = true;
    },
    /*
     *@Author: yozora
     *@Description: 仲裁预言机
     *@Date: 2021-03-18 18:33:00
     */
    async annealButtonClick(oracleData) {
      let oid = parseInt(oracleData.OracleID);
      console.log("oid", oid);
      this.updateToastAndShow("Anneal Oracle", `Getting: Oracle【#${oid}】 Opponent  …… ……`);
      let _opponent = (
        await this.NAPContract.getPastEvents("GoteJoinedAndRawStgSet", {
          filter: { OracleID: oid },
          fromBlock: this.BlockNumber - 4900,
        })
      ).pop().returnValues.Player;
      let ols = this.LSSent[oid];
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
              LocalData_Sent.save(this.LSSent, this.LS_NetWork);
              ols = { hsetp, stg, bid };
              MissAgrs = false;
              delete this.LSCache[i];
              LocalData_Cache.save(this.LSCache, this.LS_NetWork);
            }
          } catch (error) {
            console.log("Recover stg err:", error);
          }
        }
      }
      if (MissAgrs) {
        this.updateToastAndShow(`Anneal Oracle【#${oid}】`, `Encryption parameter missing`);
        return;
      }

      this.updateToastAndShow(`Anneal Oracle【#${oid}】`, `Pending: Anneal Oracle …… ……`);
      this.isPending = true;
      this.staticBackdropPending = true;
      let rst = await this.NAPContract.methods.makeAnneal(oid, ols.hsetp, ols.stg, ols.bid, _opponent).send({ from: this.addressNow });
      this.dt = rst;
      // 删除sent 策略释放空间
      if (rst.events.OracleOver.transactionHash) {
        delete this.LSSent[oid];
        LocalData_Sent.save(this.LSSent, this.LS_NetWork);
      }
      // 删除监听
      this.deleteSubscribeJoin(oid);
      this.staticBackdropPending = false;
      this.isPending = false;
      this.oracleOverContent = {};
      let evt = rst.events.OracleOver.returnValues;
      this.dt = evt;
      let _overTitle;
      let _overText;
      let _result;
      if (evt.Winner.toLowerCase() == this.addressNow) {
        _overTitle = `#${oid}`;
        _result = "😁: You Win🎉!";
        _overText = `【😁:You Win🎉!】. 【🏆:${this.web3js.utils.fromWei(String(evt.Prize), "ether")}$${this.coinName[this.netWork]}】.【(Init) Your Stg:${this.fingers[evt.Strategy_Init]}】.【GoteStg:${
          this.fingers[evt.Strategy_Gote]
        }】.【OraclePrice:${parseFloat(String((2 * evt.ValidBid) / evt.Prize)).toLocaleString()}$NAP/$${this.coinName[this.netWork]}】.【OverReason:${this.oracle_overReason[evt.Reason]}】`;
      } else {
        // _overTitle = `Annealed Oracle【#${oid}】`;
        _overTitle = `#${oid}`;
        _result = `Winner: ${evt.Winner}`;
        _overText = `【Winner:${evt.Winner}】. 【🏆:${this.web3js.utils.fromWei(String(evt.Prize), "ether")}$${this.coinName[this.netWork]}】.【(Init) Your Stg:${this.fingers[evt.Strategy_Init]}】.【GoteStg:${
          this.fingers[evt.Strategy_Gote]
        }】.【OraclePrice:${parseFloat(String((2 * evt.ValidBid) / evt.Prize)).toLocaleString()}$NAP/$${this.coinName[this.netWork]}】.【OverReason:${this.oracle_overReason[evt.Reason]}】`;
      }
      this.getMyCreateWaitAnneal();
      this.oracleOverContent.OracleID = _overTitle;
      this.oracleOverContent.Result = _result;
      this.oracleOverContent.Reward = `🏆: ${this.web3js.utils.fromWei(String(evt.Prize), "ether")}`;
      this.oracleOverContent.Creator_strategy = `Creator_strategy: ${this.fingers[evt.Strategy_Init]}`;
      this.oracleOverContent.Challenger_strategy = `Challenger_strategy: ${this.fingers[evt.Strategy_Gote]}`;
      this.oracleOverContent.OraclePrice = `OraclePrice: ${parseFloat(String((2 * evt.ValidBid) / evt.Prize)).toLocaleString()}$NAP/$${this.coinName[this.netWork]}`;
      // this.oracleOverContent = _overTitle + _overText;
      this.staticBackdropAnnealed = true;
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
      let cacheOracleDatas = [];
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
                console.log(rst2);
              });
          }
          this.updateToastAndShow(`${this.filterButtonText[1][0]}`, `Success: Oracle ID in range 【#${_startID}~#${Number(_startID) + Number(_limit) - 1}】——> Fetched ${this.filterButtonText[1][0]} datas.`);
        });
      // 可加入预言机
      console.log("可加入预言机");
      this.myLogs = cacheOracleDatas;
    },
    getMyOracleIDsRLByState(_state, _myState, _startID, _limit) {
      if (_startID == "") {
        _startID = 1;
      }
      this.myLogs = [];
      this.NAPContract.methods
        .getMyOracleIDsRLByState(_state, _startID, _limit)
        .call({ from: this.addressNow })
        .then(OracleIDRLs => {
          let cacheOracleDatas = [];
          if (_myState == 201) {
            //自己创建的（等待加入和等待退火的）
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
                      // console.log("自己创建的（等待加入和等待退火的）");
                      // cacheOracleDatas.forEach(item => console.log(item));
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
                      // console.log("别人创建自己加入");
                      // cacheOracleDatas.forEach(item => console.log(item));
                    }
                  });
              }
            }
          }
          console.log("我的预言机");
          this.myLogs = cacheOracleDatas;
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
      console.log("Listen_oids", _oids);
      try {
        if (_oids.length == 0) _oids = [0];
      } catch (error) {
        _oids = [0];
      }
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
        .on("data", function() {})
        .on("changed", function() {})
        .on("error", console.error);
    },
    deleteSubscribeJoin(_oid) {
      try {
        this.LSWaitJoin.splice(this.LSWaitJoin.indexOf(parseInt(_oid)), 1);
        LocalData_WaitJoin.save(this.LSWaitJoin, this.LS_NetWork);
      } catch (error) {
        console.log("#", _oid, ": delete listen wait join error, may not listening", error);
      }
    },
    cWaitJoin() {
      this.LSWaitJoin = [];
      LocalData_WaitJoin.save(this.LSWaitJoin, this.LS_NetWork);
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
      console.log(`NAPAddress@${this.netWork}`, this.NAPAddress);
      // 挂载好且网络检测好之后才读取ls
      this.LS_NetWork = this.netWork;
      this.LSCache = LocalData_Cache.fetch(this.LS_NetWork);
      this.LSSent = LocalData_Sent.fetch(this.LS_NetWork);
      this.LSWaitJoin = LocalData_WaitJoin.fetch(this.LS_NetWork);
      console.log(`LSWaitJoin:${this.LSWaitJoin}`);
      this.tokens.push(this.coinName[this.netWork]);
      this.create_joinfee.unit = this.coinName[this.netWork];
      this.initUserData();
      this.chartTitle.push(`{a|0.023 }{b|${this.coinName[this.netWork]} / }{x|NAP}`);
      this.oracle_create_waitblocks = 4000;
    },
    async initUserData() {
      this.tabMode = 1;
      this.activeKey = "1";
      this.myLogs = [];
      this.OracleLogs = [];
      this.callback("1");
      await this.RefreshAccount();
      await this.intervalRefresh();
      // await this.getJoinAbleOracles();
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
      } else if (key === "2") {
        // 加载我的-等待加入
        this.activeKey = "2";
        this.getMyCreateWaitJoin();
      } else if (key === "3") {
        this.activeKey = "3";
        // 加载我的-等待仲裁
        this.getMyCreateWaitAnneal();
      } else if (key === "4") {
        this.activeKey = "4";
        // 加载我的-等待仲裁结果
        this.getMyJoinedWaitAnneal();
      } else if (key === "5") {
        this.activeKey = "5";
        // 加载日志-我创建的
        this.getMyCreateLogs();
      } else if (key === "6") {
        this.activeKey = "6";
        // 加载日志-我加入的
        this.getMyJoinedLogs();
      } else if (key === "7") {
        this.activeKey = "7";
        // 加载日志-我获胜的
        this.getMyWonLogs();
      } else if (key === "8") {
        this.activeKey = "8";
        // 加载日志-最近创建
        this.getReCrLogs();
      } else if (key === "9") {
        this.activeKey = "9";
        // 加载日志-最近加入
        this.getReJnLogs();
      } else if (key === "10") {
        this.activeKey = "10";
        // 加载日志-最近结束
        this.getReOvLogs();
      } else if (key === "11") {
        this.activeKey = "11";
        // 加载日志-最近取消
        this.getReCcd();
      }
    },
    // sortLogs(logs) {
    //   return logs.sort(function(a, b) {
    //     console.log(`${a.OracleID} --- ${b.OracleID}`);
    //     console.log(parseInt(a.OracleID) - parseInt(b.OracleID));
    //     return parseInt(a.OracleID) - parseInt(b.OracleID) > 0;
    //   });
    // },
    /*
     *@Author: yozora
     *@Description: 产生随机数
     *@Date: 2021-03-15 11:40:15
     */
    randomNum() {
      this.diceSpin = true;
      this.diceStyle = { "font-size": "24px", color: "#722ed1", transform: "scale(2)" };
      setTimeout(() => {
        this.create_rawEntropy = Math.random();
        this.diceStyle = { "font-size": "24px" };
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
    flipCard() {
      document.getElementsByClassName("re-item-front")[0].classList.remove("flip");
      document.getElementsByClassName("re-item-back")[0].classList.remove("flip");
    },
    /*
     *@Author: yozora
     *@Description: 切换tabs菜单
     *@Date: 2021-03-18 22:25:06
     */
    handleTabs({ key }) {
      if (key === "1") {
        this.tabMode = 1;
        this.activeKey = "1";
        this.callback("1");
      } else if (key === "2") {
        this.tabMode = 2;
        this.activeKey = "5";
        this.callback("5");
      }
    },
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
          "min-width": "auto",
          // width: "420px",
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
     *@Description: 加入预言机卡片翻转
     *@Date: 2021-03-18 16:33:57
     */
    handleJoinOracleCard(oracleData) {
      this.joiningOracleID = oracleData.OracleID;
      this.oracle_join_joinfee = oracleData.joinFee;
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

      // 存入并验证缓存
      let cacheLengthBefore = this.LSCache.length;
      this.LSCache.push({ EncryptedStg, hsetp, stg, bid });
      LocalData_Cache.save(this.LSCache, this.LS_NetWork);
      //等待写入
      this.sleep(100);
      if (!(this.LSCache.length > cacheLengthBefore)) {
        // 写入失败提示
        message.error("Write preImage cache error …… ……", 2);
        return;
      }

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
          let oid = parseInt(rst.events.newOracleCreateAndHashStgSet.returnValues.OracleID);
          // 记录发出的加密策略的原象
          this.LSSent[oid] = { hsetp, stg, bid };
          console.log(`LSSent:${this.LSSent}`);
          LocalData_Sent.save(this.LSSent, this.LS_NetWork);
          if (rst.events.newOracleCreateAndHashStgSet.transactionHash) {
            // 删除防止刷新丢失捕捉的加密策略原象
            this.LSCache.pop();
            LocalData_Cache.save(this.LSCache, this.LS_NetWork);
          }
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
          LocalData_WaitJoin.save(this.LSWaitJoin, this.LS_NetWork);
          this.subscribeJoin(this.LSWaitJoin);
        })
        .catch(e => {
          console.log(e);
          if (e.code === 4001) {
            this.staticBackdropPending = false;
            message.warning("你取消了创建预言机", 2);
          }
        });
      // 定位到我的-等待加入
      this.tabMode = 1;
      this.activeKey = "2";
      document.getElementsByClassName("re-item-front")[0].classList.remove("flip");
      document.getElementsByClassName("re-item-back")[0].classList.remove("flip");
      this.createOracleStep = 1;
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
      console.log(this.web3js.utils.toWei(String(this.oracle_joing_bidFee)));
      console.log(this.web3js.utils.toWei(String(this.oracle_join_joinfee)));
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
.modal-a {
  position: fixed;
  top: 30%;
  z-index: 1;
}

.bg-log {
  background: rgb(255, 251, 240);
  /* background-color:#4CC8CA; */
  /* border:10px solid #4CC8CA; */
  /* box-shadow:0 0 60px #245677;
	-moz-box-shadow:0 0 60px #245677;
	-webkit-box-shadow:0 0 60px #245677; */
  box-shadow: 0 0 60px #4cc8ca;
  -moz-box-shadow: 0 0 60px #4cc8ca;
  -webkit-box-shadow: 0 0 60px #4cc8ca;
}

.bg-oracle {
  background: rgb(255, 251, 240);
  /* background-color:#CA99E8; */
  /* border:10px solid #CA99E8; */
  /* box-shadow:0 0 60px #5946A3;
	-moz-box-shadow:0 0 60px #5946A3;
	-webkit-box-shadow:0 0 60px #5946A3; */
  box-shadow: 0 0 60px #ca99e8;
  -moz-box-shadow: 0 0 60px #ca99e8;
  -webkit-box-shadow: 0 0 60px #ca99e8;
}

.container >>> .ant-divider.ant-divider-horizontal {
  background-color: #5946a3;
}

.card-shadow >>> .ant-card.ant-card-small,
.ant-card.ant-card-bordered,
.ant-carousel {
  border-radius: 1rem;
}

.neon:focus {
  background-color: rgba(242, 242, 242, 1);
}

.avatarIcon:hover {
  background-color: rgba(242, 242, 242, 1);
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
  padding: 5px;
  border: 2px solid rgba(242, 242, 242, 1);
  border-radius: 50px;
}

.control-input.ant-input-group-wrapper >>> input {
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

.strategy-block {
  width: 70%;
  margin-top: 2em;
}

.strategy-input-bottom {
  box-shadow: inset 2px 2px 5px #8f8787;
  background: #fff;
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

.strategy-tabs >>> .ant-card.ant-card-bordered.ant-card-contain-grid.ant-card-small,
.ant-card.ant-card-bordered.ant-card-small {
  border-radius: 10px;
  background-color: rgba(242, 242, 242, 1);
}

.strategy-tabs >>> .ant-card-grid.ant-card-grid-hoverable {
  width: 70%;
  text-align: center;
  margin-top: 2em;
  /* flexible */
  margin-left: 2em;
  padding: 1em;
  border-radius: 10px;
  background-color: rgb(255, 255, 255);
}

.strategy-tabs >>> .ant-card-meta-detail {
  margin-left: 5em;
  margin-top: -1px;
}

/* .strategy-tabs >>> .ant-tabs-tab.ant-tabs-tab-disabled{
  background-color:rgba(242, 242, 242, 1);
} */

.strategy-tabs >>> .ant-card-meta-avatar {
  margin-right: 3.5em;
  margin-top: -1px;
}

.strategy-tabs-icon {
  padding: 1em 1em 1em 3em;
  background-color: rgba(242, 242, 242, 1);
  float: left;
  margin-left: 2em;
  border-radius: 10px;
}

.strategy-tabs-icon-you {
  padding: 1em 1em 1em 3em;
  background-color: rgba(242, 242, 242, 1);
  float: left;
  border-radius: 10px;
}

.strategy-tabs-div-left {
  float: left;
  margin-left: 5em;
}

.strategy-tabs-div-right {
  float: right;
  margin-right: 5em;
}

.log-icon {
  font-size: 16px;
  margin-right: 5px;
  transform: translate(0px, -5px);
}

.neon {
  color: #cce7f8;
  font-size: 0.5rem;
  font-family: "Pacifico";
  text-transform: uppercase;
}

.bg-card.padding-box >>> .ant-divider.ant-divider-vertical {
  height: 2em;
  margin: 1em;
}

.card-shadow {
  /* box-shadow: 2px 2px 5px 5px #8f8787;
  border-radius: 10px; */
}

.card-body >>> .ant-card-meta-avatar {
  float: right;
}

.card-body >>> .ant-tabs-bar.ant-tabs-top-bar {
  text-align: left;
}

.card-body >>> .ant-btn:focus {
  color: #722ed1;
}

.ant-carousel >>> .slick-slide {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel >>> .slick-slide h3,
.slick-slide h6 {
  color: #fff;
}

.card-shadow .re-item-front.flip {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
}

.card-shadow .re-item-back.flip {
  transform: rotateY(0deg);
  -webkit-transform: rotateY(0deg);
}

.flipper {
  transition: 1.2s;
  transform-style: preserve-3d;
  position: relative;
}

.re-item-front,
.re-item-back {
  position: absolute;
  backface-visibility: hidden;
}

.re-item-back {
  position: relative;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
}
</style>
