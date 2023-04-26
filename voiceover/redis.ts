import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: "https://advanced-robin-30444.upstash.io",

  token:
    "AXbsACQgMjk0YjI1ZTctOGRiNi00MjE3LTg0NGMtYjM3MWZhZjU0M2YwOTdlMWY3ZDZjMTk0NDljYzlhYWFmZWI3YmRmZGE0YmU=",
})

export default redis
