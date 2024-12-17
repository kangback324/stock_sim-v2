const response = (statuscode, req, res, data) => {
    const now = new Date();

    const koreanTime = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(now);

    const timestamp = `${koreanTime.replace(/\./g, '-').replace(/\s/g, 'T')} KCT`;

    res.status(statuscode).json({
        statuscode: statuscode,
        path: req.path,
        method: req.method,
        data: data,
        timestamp: timestamp
    });
};

module.exports = response;
