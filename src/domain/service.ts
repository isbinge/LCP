import httpRequest from '@/utils/http-request';
import { API } from '@/config';

export async function healthCheck() {
  return httpRequest({
    api: API.global.HEALTH_CHECK,
    ttl: 0,
  });
}
