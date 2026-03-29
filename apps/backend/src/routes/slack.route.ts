// import { Router } from 'express';
// import { WebClient } from '@slack/web-api';
//
// const router = Router();
// // ... other setup ...
//
// router.get('/callback', async (req, res) => {
//     const { code } = req.query;
//     try {
//         // Exchange the temporary code for an access token
//         const client = new WebClient(); // client instantiated without a token yet
//         const response = await client.oauth.v2.access({
//             client_id: process.env.SLACK_CLIENT_ID,
//             client_secret: process.env.SLACK_CLIENT_SECRET,
//             code: code,
//             redirect_uri: 'YOUR_REDIRECT_URI',
//         });
//
//         // Response contains user and app data
//         const { access_token, scope, team, user } = response;
//         // ... proceed to store credentials ...
//         res.send('You have successfully logged in with your Slack account!');
//
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Authentication failed');
//     }
// });
//
// export default router;