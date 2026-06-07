export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/team/index',
    'pages/match/index',
    'pages/record/index',
    'pages/message/index',
    'pages/schedule/index',
    'pages/schedule-detail/index',
    'pages/review/index',
    'pages/record-result/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0F0F1A',
    navigationBarTitleText: '电竞约战平台',
    navigationBarTextStyle: 'white',
    backgroundColor: '#0F0F1A'
  },
  tabBar: {
    color: '#6B6B80',
    selectedColor: '#7B2FFD',
    backgroundColor: '#1A1A2E',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/team/index',
        text: '队伍'
      },
      {
        pagePath: 'pages/match/index',
        text: '约战'
      },
      {
        pagePath: 'pages/record/index',
        text: '战绩'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      }
    ]
  }
})
