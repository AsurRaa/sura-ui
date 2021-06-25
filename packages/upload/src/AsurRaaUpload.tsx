import { Upload } from "antd";
import ImgCrop, { ImgCropProps } from "antd-img-crop";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import React from "react";
import { FC, useEffect, useState } from "react";
import { useGetProviderAsurRaaUpload } from "./AsurRaaUploadProvider";

export interface AsurRaaSingleUploadProps extends UploadProps {
  getReturnUrl?: (url: any) => void;
  defaultImage?: string | null | undefined;
  corpProps?: ImgCropProps;
}
export interface uploadInterface {
  uuid: string;
  cdn: string;
}

export const useGetReturnSingleImageFromServer = (uuid: string | undefined) => {
  const global = useGetProviderAsurRaaUpload();
  const fullUrl = `${global?.returnImagePath}${uuid}`;
  return fullUrl;
};

export const AsurRaaSingleUpload: FC<AsurRaaSingleUploadProps> = (props) => {
  const global = useGetProviderAsurRaaUpload();
  const [fileList, setFileList] = useState<Array<UploadFile<uploadInterface>>>(
    []
  );
  const imageUrl = useGetReturnSingleImageFromServer(props?.defaultImage ?? "");

  useEffect(() => {
    if (props.defaultImage !== undefined) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url:
            props.defaultImage === null ||
            props.defaultImage === undefined ||
            props.defaultImage === ""
              ? undefined
              : imageUrl,
          size: 100,
          type: "",
          // @ts-ignore
          originFileObj: "hi",
        },
      ]);
    }
  }, [props.defaultImage]);

  const onChange = ({
    fileList: newFileList,
  }: {
    fileList: Array<UploadFile>;
  }) => {
    setFileList(newFileList);
    props?.getReturnUrl?.(newFileList[0]?.response);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        // @ts-ignore
        reader.readAsDataURL(file.originFileObj);
        // @ts-ignore
        reader.onload = () => resolve(reader?.result);
      });
    }
    const image = new Image();
    // @ts-ignore
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div>
      <ImgCrop rotate {...props.corpProps}>
        <Upload
          action={global?.postUrl}
          headers={{
            ...global?.header,
          }}
          listType="picture-card"
          // @ts-ignore
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
        >
          {fileList.length < 1 && "+ Upload"}
        </Upload>
      </ImgCrop>
    </div>
  );
};
