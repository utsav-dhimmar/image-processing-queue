```txt
image-processor-queue/
├── docker-compose.yml        # Orchestrates API, Worker, Redis, Postgres
├── .env                      # Environment variables (Redis URL, DB creds)
├── uploads/                  # SHARED VOLUME: Images land here
│   ├── raw/                  # Original uploads
│   └── processed/            # Resized images
│
├── api/                      # Service 1: The Producer (Express/Node)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts         # Entry point
│       ├── routes.ts         # POST /upload, GET /status/:id
│       └── queues/
│           └── imageQueue.ts # Setup BullMQ Producer & addJob() function
│
└── worker/                   # Service 2: The Consumer (Node Script)
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts          # Entry point (Starts listening)
        ├── worker.ts         # Setup BullMQ Worker connection
        └── processors/
            └── imageTask.ts  # The heavy logic (sharp/jimp)
```
