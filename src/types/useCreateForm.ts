export namespace useCreateForm {
  export interface UseCreateFormOptions {
    data: FormDataProps;
    confirm: string | HTMLButtonElement;
    submit: (form: useCreateForm.FormData) => void;
  }

  export interface FormDataProps {
    [key: string]: FormDataProp;
  }

  export interface FormDataProp<T = any> {
    value: T;
    message?: string;
    regular?: (value: T) => boolean;
    listener?: (form: useCreateForm.FormData) => void;
  }

  export interface FormData {
    [key: string]: any;
  }

  export interface FormCheckStates {
    [key: string]: boolean;
  }
}
