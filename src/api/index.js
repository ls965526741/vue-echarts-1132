import request from '@/utils/request'
export const getData = data => request.get(`/${data}.json`)
