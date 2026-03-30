const n8nUrl = 'https://n8n.ngocnguyenxuan.com/api/v1/workflows';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NTU2YjE4Ni02NWIyLTQ5ODMtYWVkZS1lY2Y1MDNlYTQyN2YiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMDJhZmIwOGItMDg2Ny00ZTMxLTk4ZmItMmNhN2JkY2YxYjQ5IiwiaWF0IjoxNzcyNzA2NjUyfQ._sBDirp58Nd2PonXfbVwlbfKBhGb7h9GogEZ7KQvjSI';

async function createCron() {
  const workflowData = {
    "name": "[Auto SEO] Shinhan - Scheduled Publishing",
    "nodes": [
      {
        "parameters": {
          "rule": {
            "interval": [
              {
                "field": "minutes",
                "minutesInterval": 15
              }
            ]
          }
        },
        "name": "Schedule Trigger",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.2,
        "position": [ 250, 300 ]
      },
      {
        "parameters": {
          "method": "GET",
          "url": "https://tuvanvienshinhan.com/api/cms/posts/cron-publish",
          "sendQuery": false,
          "sendBody": false,
          "options": {}
        },
        "name": "HTTP Request",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.1,
        "position": [ 500, 300 ]
      }
    ],
    connections: {
      "Schedule Trigger": {
        "main": [
          [
            {
              "node": "HTTP Request",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    },
    settings: {
      "executionTimeout": 3600
    }
  };

  try {
    const res = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': apiKey
      },
      body: JSON.stringify(workflowData)
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log('Successfully created workflow on n8n. ID:', data.id);
      
      const res2 = await fetch(`${n8nUrl}/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': apiKey
        },
        body: JSON.stringify({ active: true })
      });
      if (res2.ok) console.log('Successfully activated workflow!')
    } else {
      console.error('Failed to create workflow:', await res.text());
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createCron();
