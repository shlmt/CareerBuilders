const express = require('express')
const app = express()
const os = require('os');

app.use(express.static('.'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    next();
});

app.get('/clock', (req, res) => {
    res.write(`data: hello first\n\n`)

    const intervalId = setInterval(() => {
        res.write(`data: ${new Date().toLocaleTimeString()}\n\n`)
    }, 1000)

    req.on('close', () => {
        clearInterval(intervalId)
        res.end()
    })
})

app.get('/events', (req, res) => {

    const intervalId = setInterval(() => {
        const freeMem = os.freemem() / 1024 / 1024; // זיכרון פנוי במגהבייט
        const totalMem = os.totalmem() / 1024 / 1024; // זיכרון כולל במגהבייט
        const usedMem = totalMem - freeMem;
        const uptime = os.uptime(); // זמן פעיל בשניות
        const loadAverage = os.loadavg()[0]; // עומס מעבד ב-1 דקות האחרונות

        const healthData = {
            memory: {
                total: totalMem.toFixed(2),
                used: usedMem.toFixed(2),
                free: freeMem.toFixed(2)
            },
            uptime: `${Math.floor(uptime / 60)} minutes`,
            cpuLoad: loadAverage.toFixed(2)
        };

        res.write(`data: ${JSON.stringify(healthData)}\n\n`);

    }, 5000)

    req.on('close', () => {
        clearInterval(intervalId)
        res.end()
    })
})

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`)
})
