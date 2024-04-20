import './assets/index.scss';
import { useCreateForm } from './hooks';

useCreateForm({
  data: {
    realname: {
      value: '',
      regular: (value: string) =>
        value.length > 0 && /[\u4e00-\u9fa5]/.test(value),
      message: '请输入正确的姓名',
    },
    gender: {
      value: '',
      regular: (value: string) => ['male', 'female'].includes(value),
      message: '请选择性别',
    },
    occupation: {
      value: '',
      regular: (value: string) =>
        ['frontend', 'backend', 'maintain', 'network'].includes(value),
      message: '请选择职业',
    },
    hobby: {
      value: [],
      regular: (value: string[]) =>
        value.every((v) => {
          return ['swimming', 'running', 'reading', 'coding'].includes(v);
        }),
      message: '请选择正确的爱好',
    },
    introduction: {
      value: '',
      regular: (value: string) => value.length > 0,
      message: '请输入自我介绍',
    },
  },
  confirm: '#submit',
  submit: (form) => {
    console.log(form);
  },
});
