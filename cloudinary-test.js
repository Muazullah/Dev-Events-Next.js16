const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: "xphsifzn",
    api_key: "818644847141857",
    api_secret: "-pWSvtuyuDhnIdgDc38QNvNb2j8",
});

(async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log(result);
    } catch (e) {
        console.error("FULL ERROR:");
        console.dir(e, { depth: null });
    }
})();