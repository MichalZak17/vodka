const Sentry = require("@sentry/node");
require("dotenv").config({ path: "./../.env" });

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0
});

class LogHandler {
    static async logException(exception) {
        return Sentry.captureException(exception);
    }

    static async logMessage(message) {
        return Sentry.captureMessage(message);
    }

    static async logEvent(event) {
        return Sentry.captureEvent(event);
    }    
}

module.exports = { LogHandler };