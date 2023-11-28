const timeout = 400;

const draft_mission = null
const modules = {
  "0ed54c76-eb75-44a4-a854-8fc473ef46fd": {
    "uuid": "0ed54c76-eb75-44a4-a854-8fc473ef46fd",
    "name": "Аванпост жилья и логистики (HALO)",
    "description": "Также называемый модулем минимального жилья и ранее известный как утилизационный модуль. Представляет собой уменьшенный жилой модуль станции.",
    "mass": "6,6 тонн",
    "image_url": "localhost:9000/images/0ed54c76-eb75-44a4-a854-8fc473ef46fd.jpg",
    "length": "10 метров",
    "diameter": "4 метра",
  },
  "5d386611-ce4a-46a9-ba66-68da491b613b": {
    "uuid": "5d386611-ce4a-46a9-ba66-68da491b613b",
    "name": "Аванпост жилья и логистики (HALO)",
    "description": "Также называемый модулем минимального жилья и ранее известный как утилизационный модуль. Представляет собой уменьшенный жилой модуль станции.",
    "mass": "6,6 тонн",
    "image_url": "localhost:9000/images/0ed54c76-eb75-44a4-a854-8fc473ef46fd.jpg",
    "length": "10 метров",
    "diameter": "4 метра",
  },
  "b9778018-9c13-46fd-b785-4a803dc8be0b": {
    "uuid": "b9778018-9c13-46fd-b785-4a803dc8be0b	",
    "name": "Аванпост жилья и логистики (HALO)",
    "description": "Также называемый модулем минимального жилья и ранее известный как утилизационный модуль. Представляет собой уменьшенный жилой модуль станции.",
    "mass": "6,6 тонн",
    "image_url": "localhost:9000/images/0ed54c76-eb75-44a4-a854-8fc473ef46fd.jpg",
    "length": "10 метров",
    "diameter": "4 метра",
  },
  "9b8914a6-c599-450d-893d-b8ebb766dd07": {
    "uuid": "9b8914a6-c599-450d-893d-b8ebb766dd07	",
    "name": "Аванпост жилья и логистики (HALO)",
    "description": "Также называемый модулем минимального жилья и ранее известный как утилизационный модуль. Представляет собой уменьшенный жилой модуль станции.",
    "mass": "6,6 тонн",
    "image_url": "localhost:9000/images/0ed54c76-eb75-44a4-a854-8fc473ef46fd.jpg",
    "length": "10 метров",
    "diameter": "4 метра",
  }
}


function fromNetwork(request, timeout) {
  return new Promise((fulfill, reject) => {
    var timeoutId = setTimeout(() => { reject("Timeout") }, timeout);
    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
        reject(`HTTP error: ${response.status} ${response.statusText}`);
      }
      fulfill(response);
    }).catch((error) => {
      reject(`Unknown error while sending request: ${error.message}`);
    });
  });
}

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);

  if (requestURL.pathname.startsWith('/api/modules')) {
    event.respondWith(
      fromNetwork(event.request, timeout)
        .catch((err) => {
          console.log(`${err}`);
          const moduleIdMatch = requestURL.pathname.match(/^\/api\/modules\/([^/]+)$/);

          if (moduleIdMatch) {
            const moduleId = moduleIdMatch[1];
            if (modules.hasOwnProperty(moduleId)) {
              return new Response(JSON.stringify(modules[moduleId]), {
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
              });
            } else {
              return new Response(JSON.stringify({ error: 'Module not found' }), {
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                status: 404, 
              });
            }
          } else {
            filteredModules = Object.values(modules)
            let name = requestURL.searchParams.get("name")
            if (name) {
              name = name.toLowerCase()
              filteredModules = filteredModules.filter(
                (module) => module.name.toLowerCase().includes(name)
              )
            }
            return new Response(JSON.stringify({ draft_mission, modules: filteredModules }), {
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
            });
          }
        })
    );
    } else if (requestURL.pathname.startsWith('/images')) {
      event.respondWith(
        fromNetwork(event.request, timeout)
          .catch((err) => {
            console.log(`${err}`);
          return fetch('placeholder2.jpeg')
            .then((response) => {
              return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: new Headers(response.headers),
              });
            })
            .catch((_) => {
              return new Response('Failed to load image', {
                status: 500,
                headers: { 'Content-Type': 'text/plain' },
              });
            });
        })
    );

  } else {
    event.respondWith(fetch(event.request));
  }
});