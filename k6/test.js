import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const random = Math.floor(Math.random() * 10000);
  const url = 'http://104.248.108.149/producer-api';
  const payload = JSON.stringify({
    amount: random,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
  sleep(0.01);
}
