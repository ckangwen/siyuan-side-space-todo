/* eslint-disable consistent-return */
import { isFn } from "./helper";
import axios from "axios";

const service = axios.create({
  baseURL: "http://127.0.0.1:6806/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const globalFetch = isFn(window?.fetch) ? window.fetch : window?.parent?.fetch;

export const request = async (url: string, params = {}) => {
  if (!isFn(globalFetch)) return;

  try {
    const res = await service({
      method: "POST",
      url,
      data: JSON.stringify(params),
    });

    return res.data.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const showSiYuanNotification = (
  message: string,
  type: "info" | "error" = "info",
  timeout = 2000
) => {
  return request(
    `/notification/${type === "error" ? "pushErrMsg" : "pushMsg"}`,
    {
      meg: message,
      timeout,
    }
  );
};

export const fetchBlockKramdown = async (id: string) => {
  const data = await request("/block/getBlockKramdown", {
    id,
  });
  if (data) {
    return data.kramdown;
  }

  return "";
};

export const insertBlock = async (prevId: string, content: string) => {
  const data = await request("/block/insertBlock", {
    dataType: "markdown",
    data: content,
    previousID: prevId,
  });

  return data;
};

export const updateBlock = async (id: string, content: string) => {
  const data = await request("/block/updateBlock", {
    dataType: "markdown",
    data: content,
    id,
  });

  return data;
};

export const appendBlock = async (id: string, content: string) => {
  const data = await request("/block/appendBlock", {
    dataType: "markdown",
    data: content,
    parentID: id,
  });

  return data;
};

export const deleteBlock = async (id: string) => {
  const data = await request("/block/deleteBlock", {
    id,
  });

  return data;
};
