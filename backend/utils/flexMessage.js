/**
 * 生成報到成功的 Flex Message
 */
const createCheckInSuccessFlex = (name, time) => {
  return {
    type: 'flex',
    altText: '報到完成通知',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '報到成功',
            weight: 'bold',
            size: 'xl',
            color: '#ffffff'
          }
        ],
        backgroundColor: '#4c6ef5'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: `親愛的 ${name} 您好：`,
            weight: 'bold',
            size: 'md'
          },
          {
            type: 'text',
            text: '您已成功完成實名報到程序。',
            margin: 'md',
            color: '#666666'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '報到時間',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2
                  },
                  {
                    type: 'text',
                    text: time,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 4
                  }
                ]
              }
            ]
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: '查看詳情',
              uri: 'https://line.me'
            },
            style: 'primary',
            color: '#4c6ef5'
          }
        ]
      }
    }
  };
};

module.exports = {
  createCheckInSuccessFlex
};
