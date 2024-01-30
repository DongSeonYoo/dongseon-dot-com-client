const idField = document.getElementById("id-text-field");
const pwField = document.getElementById("pw-text-field");
const pwCheckField = document.getElementById("pw-check-text-field");
const nicknameField = document.getElementById("name-text-field");
const emailField = document.getElementById("email-text-field");
const phoneNumberField = document.getElementById("phonenumber-text-field");
const verifyNumberTextField = document.getElementById(
  "verify-number-textfield"
);
const sendVerifyEmailField = document.getElementById("send-verify-email");

const phoneNumberDuplicateBtn = document.getElementById(
  "phonenumber-duplicate-button"
);
const checkAllowRadio = document.querySelector(".check-allow-phonenumber");

const loginIdRegex = /^[A-Za-z0-9]{5,15}$/;
const pwRegex = /^.{10,17}$/;
const nameRegex = /^[가-힣a-zA-Z]{2,8}$/;
const phoneNumberRegex = /^0\d{10}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let isIdDuplicate = false;
let isPhoneNumberDuplicate = false;
let isEmailDuplicate = false;
let isCheckAuthEmail = false;

window.onload = () => {
  if (checkCookie()) location.href = "/";
};

const validate = () => {
  if (!idInputValidate()) {
    return false;
  }

  if (!pwInputValidate()) {
    return false;
  }

  if (!nicknameInputValidate()) {
    return false;
  }

  if (checkAllowRadio.checked) {
  } else {
    if (!phoneNumberInputValidate()) {
      return false;
    }
  }

  if (!emailInputValidate()) {
    return false;
  }

  if (!isCheckDuplicateButton()) {
    return false;
  }

  if (!isCheckAuthEmail) {
    alert("이메일 인증을 완료해 주세요");
    return false;
  }

  return true;
};

const onchangeVerifyNumber = (event) => {};

const idInputValidate = () => {
  if (idField.value === "") {
    alert("아이디를 입력해주세요");
    idField.focus();
    return false;
  }

  if (!loginIdRegex.test(idField.value)) {
    alert("아이디는 영문자, 숫자 조합의 5 ~ 15자 이내 문자열이어야 합니다.");
    idField.focus();
    return false;
  }

  return true;
};

const pwInputValidate = () => {
  if (pwField.value === "") {
    alert("비밀번호를 입력해주세요");
    pwField.focus();
    return false;
  }

  if (!pwRegex.test(pwField.value)) {
    alert(
      "비밀번호는 영문자, 숫자, 특수문자 조합의 8~25자리 문자열이어야 합니다."
    );
    pwField.focus();
    return false;
  }

  return true;
};

const nicknameInputValidate = () => {
  if (nicknameField.value === "") {
    alert("닉네임을 입력해주세요");
    nicknameField.focus();
    return false;
  }

  if (!nameRegex.test(nicknameField.value)) {
    alert("닉네임은 영문자, 한글, 숫자 조합의 2~8자 이내 문자열이어야 합니다.");
    nicknameField.focus();
    return false;
  }

  return true;
};

const phoneNumberInputValidate = () => {
  // if (checkAllowRadio.value === "not-select-phonenumber") {
  //     return true; // "not-select-phonenumber" 옵션이 선택되었을 때 true를 반환
  // }

  if (checkAllowRadio.checked) {
    if (phoneNumberField.value === "") {
      alert("전화번호를 입력해주세요 +");
      phoneNumberField.focus();
      return false;
    }
  }

  if (
    checkAllowRadio.checked &&
    !phoneNumberRegex.test(phoneNumberField.value)
  ) {
    alert("전화번호는 010으로 시작하는 11자리 숫자 문자열이어야 합니다.");
    phoneNumberField.focus();
    return false;
  }

  return true;
};

const emailInputValidate = () => {
  if (emailField.value === "") {
    alert("이메일을 입력해주세요");
    emailField.focus();
    return false;
  }

  if (!emailRegex.test(emailField.value)) {
    alert("유효한 이메일 주소를 입력해주세요");
    emailField.focus();
    return false;
  }

  return true;
};

const isCheckDuplicateButton = () => {
  if (!isIdDuplicate) {
    alert("아이디 중복체크를 완료해주세요");
    return false;
  }

  if (checkAllowRadio.checked && !isPhoneNumberDuplicate) {
    alert("전화번호 중복체크를 완료해주세요");
    return false;
  }

  if (!isEmailDuplicate) {
    console.log(isEmailDuplicate);
    alert("이메일 중복체크를 완료해주세요");
    return false;
  }

  return true;
};

const clickIdDuplicate = () => {
  if (idInputValidate()) {
    fetchIdDuplicate();
  }
};

const clickPhoneNumberDuplicate = () => {
  if (phoneNumberInputValidate()) {
    fetchPhoneNumberDuplicate();
  }
};

const clickEmailDuplicate = () => {
  if (emailInputValidate()) {
    fetchEmailDuplicate();
  }
};

const clickSignup = () => {
  console.log(isEmailDuplicate);
  console.log(isCheckAuthEmail);
  if (validate()) {
    fetchSignupData();
  }
};

const onchangeIdInput = () => {
  isIdDuplicate = false;
};

const onchangePhoneNumberInput = () => {
  isPhoneNumberDuplicate = false;
};

const onchangeEmailInput = () => {
  isEmailDuplicate = false;
};

const fetchIdDuplicate = async () => {
  try {
    const rseponse = await fetch(
      `${serverUrl}/api/account/duplicate/login-id/` + idField.value
    );
    const json = await rseponse.json();
    if (rseponse.status === 200) {
      alert(json.message);
      isIdDuplicate = true;
    } else if (rseponse.status === 400) {
      alert(json.message);
    }
  } catch (error) {
    alert(error.message);
  }
};

const fetchPhoneNumberDuplicate = async () => {
  try {
    const response = await fetch(
      `${serverUrl}/api/account/duplicate/phone-number/` +
        phoneNumberField.value
    );
    const json = await response.json();
    if (response.status === 200) {
      alert(json.message);
      isPhoneNumberDuplicate = true;
    } else if (response.status === 400) {
      alert(json.message);
    }
  } catch (error) {
    alert(error.message);
  }
};

const fetchEmailDuplicate = async () => {
  try {
    const response = await fetch(
      `${serverUrl}/api/account/duplicate/email/` + emailField.value
    );
    const json = await response.json();
    if (response.status === 200) {
      alert(json.message);
      isEmailDuplicate = true;
    } else if (response.status === 400) {
      alert(json.message);
    }
  } catch (error) {
    alert(error.message);
  }
};

const fetchSignupData = async () => {
  const loginId = idField.value;
  const password = pwField.value;
  const name = nicknameField.value;
  const phoneNumber = phoneNumberField.value;
  const email = emailField.value;

  try {
    const res = await fetch(`${serverUrl}/api/account/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginId,
        email,
        password,
        name,
        phoneNumber,
      }),
    });

    const json = await res.json();
    if (res.status === 200) {
      alert(json.message);
    } else {
      alert(json.message);
    }
  } catch (err) {
    alert(err.message);
  }
};

const togglePhoneNumberField = (radioButton) => {
  const phoneNumberField = document.getElementById("phonenumber-text-field");

  if (radioButton.value === "not-select-phonenumber") {
    phoneNumberField.disabled = true;
    phoneNumberField.value = "";
    phoneNumberDuplicateBtn.disabled = true;
  } else {
    phoneNumberField.disabled = false;
    phoneNumberDuplicateBtn.disabled = false;
  }
};

const clickSendVerifyEmail = async () => {
  if (!isEmailDuplicate) {
    return alert("이메일 중복 체크를 완료해주세요");
  }

  try {
    if (emailInputValidate()) {
      // 이메일 정규식 검증 성공 시 인증번호 전송할수있도록
      const response = await fetch(`${serverUrl}/api/auth/send-auth-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailField.value,
        }),
      });

      const json = await response.json();
      if (response.status === 200) {
        alert(json.message);
      } else {
        alert(json.message);
      }
      sendVerifyEmailField.disabled = true;
    }
  } catch (error) {
    alert(error);
  }
};

const onclickCheckVerify = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/check-auth-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailField.value,
        code: parseInt(verifyNumberTextField.value),
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      isCheckAuthEmail = true;
      alert(data.message);
    }

    return alert(data.message);
  } catch (error) {
    console.log(error.message);
  }
};
