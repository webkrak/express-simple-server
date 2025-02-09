const axios = require('axios');
const express = require('express');
const server = express();
const PORT = process.env.PORT || 3300;

server.use(express.static('public'));

server.get('/', (_req, res) => {
  if (process.env.APP_CRASH === 'true') {
    throw new Error(
      'App crashed because environment variable APP_CRASH is set to true'
    );
  }

  console.log('Hello home root message');
  res.send('Hello Express!');
});

server.get('/fetch-wordpress-graphql', async (_req, res) => {
  const query = `
    query QueryPosts {
      posts {
        nodes {
          id
          content
          title
          slug
          featuredImage {
            node {
              mediaDetails {
                sizes {
                  sourceUrl
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post(process.env.GRAPHQL_API_URL, { query });
  res.send(response.data.data.posts.nodes);
});

server.get('/envs', (req, res) => {
  console.log(process.env);
  res.send(process.env);
});

server.listen(PORT, () => {
  console.log(`Application is listening at port ${PORT}`);
});
