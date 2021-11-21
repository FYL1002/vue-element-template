// 这里放校验规则
import i18n from '@/lang';

export default function(ruleKey) {
    const rules = {
      name: [
        { required: true, message: i18n.t('role.fields.name') + i18n.t('noticeMsg.NotEmpty'), trigger: 'change' }
      ],
      description: [
        { required: true, message: i18n.t('role.fields.description') + i18n.t('noticeMsg.NotEmpty'), trigger: 'change' }
      ],
      userName: [
        { required: true, message: i18n.t('user.fields.name') + i18n.t('noticeMsg.NotEmpty'), trigger: 'change' },
        { pattern: /^[0-9a-zA-Z\u4e00-\u9fa5_]*$/, message: i18n.t('noticeMsg.passwordFormat'), trigger: 'change' },
        { min: 4, max: 20, message: i18n.t('user.fields.name') + i18n.t('noticeMsg.shouldBeXToYCharacter').replace(/{min}/, '4').replace(/{max}/, '20'), trigger: 'change' }
      ],
      password: [
        { required: true, message: i18n.t('commonFields.password') + i18n.t('noticeMsg.NotEmpty'), trigger: 'change' },
        { pattern: /^[a-zA-Z\d!@#$%^&*]+$/, message: i18n.t('commonFields.password') + i18n.t('noticeMsg.incorrectFormat'), trigger: 'change' },
        { min: 6, max: 20, message: i18n.t('commonFields.password') + i18n.t('noticeMsg.shouldBeXToYCharacter').replace(/{min}/, '6').replace(/{max}/, '20'), trigger: 'change' }
      ],
      confirmPassword: [
        { required: true, message: i18n.t('commonFields.password') + i18n.t('noticeMsg.NotEmpty'), trigger: 'change' },
        { validator: null, trigger: 'change' }
      ],
      nickName: [
        { max: 20, message: i18n.t('commonFields.nickName') + i18n.t('noticeMsg.maxlength').replace(/{maxlength}/, '20'), trigger: 'change' }
      ],
      realName: [
        { max: 20, message: i18n.t('commonFields.realName') + i18n.t('noticeMsg.maxlength').replace(/{maxlength}/, '20'), trigger: 'change' }
      ],
      mobile: [
        { pattern: null, message: i18n.t('commonFields.mobile') + i18n.t('noticeMsg.incorrectFormat'), trigger: 'change' }
      ],
      email: [
        { pattern: /^[a-zA-Z0-9][a-zA-Z0-9-_\.]{0,19}@[a-zA-Z0-9][a-zA-Z0-9-_\.]{0,11}\.[a-zA-Z]{2,10}$/, message: i18n.t('commonFields.email') + i18n.t('noticeMsg.incorrectFormat'), trigger: 'change' }
      ]
    };
    const result = {};
    if (!ruleKey || !ruleKey.length) return {};
    ruleKey.forEach((value) => {
        rules[value] && (result[value] = rules[value]);
    });
    return result;
}
