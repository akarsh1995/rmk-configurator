import { RmkEditorErrorCode } from "../utils/enums";

class RmkFwEditorError extends Error {
  code: string;

  /**
   *
   */
  constructor(defxErrorCode: RmkEditorErrorCode) {
    super(defxErrorCode);

    this.code = defxErrorCode;

    Object.setPrototypeOf(this, RmkFwEditorError.prototype);
  }

}

export default RmkFwEditorError;
