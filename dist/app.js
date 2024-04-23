"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
require("reflect-metadata");
const data_source_1 = require("./database/data-source");
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
dotenv_1.default.config();
// database connection
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Connected to the PostgresSql database successfully");
})
    .catch((error) => console.log(error));
const app = (0, express_1.default)();
const frontEndUrl = process.env.FRONTEND_URL;
app.use((0, cors_1.default)({
    origin: frontEndUrl,
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'build')));
app.use('/', index_1.default);
app.use('/users', users_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.use((req, res, next) => {
    // Set Cache-Control: no-cache for specific routes or all routes
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500).json({ error: err.message });
});
exports.default = app;
