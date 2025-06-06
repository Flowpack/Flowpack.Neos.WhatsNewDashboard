(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@neos-project/neos-ui-extensibility/dist/readFromConsumerApi.js
  function readFromConsumerApi(key) {
    return (...args) => {
      if (window["@Neos:HostPluginAPI"] && window["@Neos:HostPluginAPI"][`@${key}`]) {
        return window["@Neos:HostPluginAPI"][`@${key}`](...args);
      }
      throw new Error("You are trying to read from a consumer api that hasn't been initialized yet!");
    };
  }
  var init_readFromConsumerApi = __esm({
    "node_modules/@neos-project/neos-ui-extensibility/dist/readFromConsumerApi.js"() {
    }
  });

  // node_modules/@neos-project/neos-ui-extensibility/dist/shims/vendor/react/index.js
  var require_react = __commonJS({
    "node_modules/@neos-project/neos-ui-extensibility/dist/shims/vendor/react/index.js"(exports, module) {
      init_readFromConsumerApi();
      module.exports = readFromConsumerApi("vendor")().React;
    }
  });

  // node_modules/@neos-project/neos-ui-extensibility/dist/index.js
  init_readFromConsumerApi();
  var dist_default = readFromConsumerApi("manifest");

  // src/WhatsNewNotificationModal.tsx
  var import_react = __toESM(require_react());
  var WhatsNewNotificationModal = () => {
    const [showModal, setShowModal] = (0, import_react.useState)(false);
    const [apiData, setApiData] = (0, import_react.useState)(null);
    const fetchData = async () => {
      try {
        const response = await fetch("/api/whats-new/in-project");
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };
    (0, import_react.useEffect)(() => {
      const cookies = Object.fromEntries(document.cookie.split("; ").map((c) => c.split("=")));
      !apiData && fetchData();
      if (!cookies.whatsNewNoteClosedTimestamp || apiData && cookies.whatsNewNoteClosedTimestamp < apiData.clientNotificationTimestamp) {
        setShowModal(true);
      }
    }, [apiData, fetchData]);
    const closeModal = () => {
      const expires = /* @__PURE__ */ new Date();
      expires.setFullYear(expires.getFullYear() + 5);
      document.cookie = `whatsNewNoteClosedTimestamp=${Date.now()}; expires=${expires.toUTCString()}; path=/`;
      setShowModal(false);
    };
    return showModal ? /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "#000" }, onClick: closeModal }, /* @__PURE__ */ import_react.default.createElement("p", null, "Testingn Blub")) : null;
  };
  var WhatsNewNotificationModal_default = WhatsNewNotificationModal;

  // src/manifest.js
  dist_default("Flowpack.Neos.WhatsNewDashboard:whatsNewNotificationModal", {}, (globalRegistry) => {
    const containerRegistry = globalRegistry.get("containers");
    containerRegistry.set("Modals/WhatsNewNotificationModal", WhatsNewNotificationModal_default);
  });
})();
