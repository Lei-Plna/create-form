import { useCreateForm } from '../types';
import { hasProperty, isInstanceof } from '../utils';
export default (options: useCreateForm.UseCreateFormOptions) => {
  const { confirm, data, submit } = options;
  const oSubmit = mountSubmitBtn();
  const form: useCreateForm.FormData = {};
  const formCheckStates: useCreateForm.FormCheckStates = {};

  const createFormCheck = () => {
    for (const [key, option] of Object.entries(data)) {
      const formElements = document.getElementsByName(key);

      if (!formElements.length) {
        continue;
      }

      if (hasProperty(option, 'value')) {
        form[key] = option.value;
      }

      if (hasProperty(option, 'regular')) {
        formCheckStates[key] = false;
      }

      if (formElements.length <= 1) {
        // simple element like input, select, textarea
        bindSimpleElement(formElements[0], key, option);
      } else {
        // complex element like radio, checkbox
        bindComplexElements(formElements, key, option);
      }
    }

    oSubmit.addEventListener('click', (e) => handleSubmit(e), false);
  };

  function mountSubmitBtn() {
    let submit: HTMLButtonElement | null = null;
    if (typeof confirm === 'string') {
      submit = document.querySelector(confirm);
    } else if (isInstanceof<HTMLButtonElement>(confirm, HTMLButtonElement)) {
      submit = confirm;
    }

    if (!submit) {
      throw new Error('Submit button is not found');
    }

    return submit;
  }

  function bindSimpleElement(
    formElement: HTMLElement,
    key: string,
    option: useCreateForm.FormDataProp
  ) {
    const tagName = formElement.tagName.toLowerCase();
    formElement.addEventListener(
      tagName === 'select' ? 'change' : 'input',
      (e: Event) => handleInput(e, key, option)
    );
  }

  function checkFormReady() {
    for (const value of Object.values(formCheckStates)) {
      if (!value) {
        oSubmit.setAttribute('disabled', 'disabled');
        return false;
      }
    }
    oSubmit.removeAttribute('disabled');
    return true;
  }

  function getElements(target: HTMLInputElement) {
    const parentNode = getFormElement(target);
    if (!parentNode) {
      throw new Error('Form element is not found');
    }
    const { value, name } = target;
    const oIcon: HTMLElement = parentNode.querySelector('.fa') as HTMLElement;
    const oMessage: HTMLElement = parentNode.querySelector(
      '.warn'
    ) as HTMLElement;

    return {
      value,
      name,
      oIcon,
      oMessage,
    };
  }

  function getFormElement(element: HTMLElement) {
    let result = element.parentElement;

    while (result && result.className !== 'form-element') {
      result = result.parentElement;
    }

    return result;
  }

  function bindComplexElements(
    formElements: NodeList,
    key: string,
    option: useCreateForm.FormDataProp
  ) {
    for (const formElement of formElements) {
      formElement.addEventListener('change', (e) =>
        handleInput(e, key, option)
      );
    }
  }

  function handleInput(
    e: Event,
    key: string,
    option: useCreateForm.FormDataProp
  ) {
    const target = e.target as HTMLInputElement;
    const type = target.type;
    const { oIcon, oMessage, value } = getElements(target);

    if (type === 'checkbox') {
      if (target.checked) {
        form[key].push(value);
      } else {
        form[key] = form[key].filter((item: unknown) => item !== value);
      }
    } else {
      form[key] = value;
    }

    if (hasProperty(option, 'regular')) {
      const isPass = option.regular(form[key]);
      oIcon.style.display = isPass ? 'inline-block' : 'none';
      oMessage.textContent = isPass ? '' : option.message ?? '';
      formCheckStates[key] = isPass;
    }

    if (hasProperty(option, 'listener')) {
      option.listener(form);
    }

    checkFormReady();
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    submit(form);
  }

  createFormCheck();
};
