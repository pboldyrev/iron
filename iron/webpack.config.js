module.exports = {
    resolve: {
        fallback: { 
            "url": require.resolve("url/"), 
            "util": require.resolve("util/"), 
            "assert": require.resolve("assert/"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify/browser")
        }
    }
};