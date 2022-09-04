import {config} from 'dotenv';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
    // ...
    plugins: [
      replace({
        env: {
            API_URL: 'url',
            API_VERSION: 'version',
          },
        preventAssignment: true
      })
    ]
  };

// export default {
//   plugins: [
//     replace({
//       // stringify the object       
//       __myapp: JSON.stringify({
//         env: {
//           isProd: production,
//           ...config().parsed // attached the .env config
//         }
//       }),
//     }),
//   ],
// };

// const production = false;

// export default {
//     plugins: [
//         replace({
//             'process.env.NODE_E': JSON.stringify('production'),
//             // 2 level deep object should be stringify
//             process: JSON.stringify({
//                 env: {
//                     userPoolId: 'us-east-1_tI86KpIJu',
//                     applicationId: '56si8bd6bsbgo3euuaof81nnvt',
//                     lambdaBaseUrl: 'https://b9k9r4joh2.execute-api.us-east-1.amazonaws.com/latest/',
//                     isProd: production,
//                 }
//             }),
//         }),
//     ],
// };
