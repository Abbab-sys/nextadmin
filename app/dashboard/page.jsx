"use client";
import Card from "../ui/dashboard/card/card";
import styles from "../ui/dashboard/dashboard.module.css";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import React, { useEffect, useState } from "react";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
const DashboardPage = () => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uppy] = useState(
    () =>
      new Uppy({
        restrictions: {
          maxNumberOfFiles: 100,
          maxFileSize: 10 * 1000 * 1000,
        },
      })
  );

  const handleUpload = async () => {
    const files = uppy.getFiles();
    const results = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("productImage", file.data);
      const response = await fetch(
        "https://mr4n2f4me0.execute-api.ca-central-1.amazonaws.com/beta/",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();

      results.push(result);
    }

    // TODO: add header to csv and add a loader, I can use object.keys and join to do that
    const csvHeader = Object.keys(results[0].productInfo).join(",");

    const encapsulate = (value) => {
      return `"${value.length > 0 ? value : "Empty"}"`;
    };

    const csvRows = results
      .map((res) => {
        const productInfo = res.productInfo;
        console.log(
          encapsulate(productInfo.product_brand),
          "product brand encapsulated"
        );
        return [
          encapsulate(productInfo.product_name),
          encapsulate(productInfo.product_brand),
          encapsulate(productInfo.format_size),
          encapsulate(productInfo.description),
          encapsulate(productInfo.category),
        ].join(",");
      })
      .join("\n");
    const csvContent = `${csvHeader}\n${csvRows}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "results.csv");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    setUploadComplete(true);
  };

  return (
    <div className={styles.wrapper}>
      <Dashboard uppy={uppy} hideUploadButton />
      <button onClick={handleUpload}>Upload</button>
      {uploadComplete && (
        <p>Upload complete! Your CSV file should have downloaded.</p>
      )}
    </div>
  );
};

export default DashboardPage;
