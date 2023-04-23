import { DOMWindow } from "jsdom"

export type WebApiService = Window | typeof globalThis | DOMWindow
