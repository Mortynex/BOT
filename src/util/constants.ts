export const GUILDEMOJI_REGEX = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
export const CODEBLOCK_REGEX = /```(?:(?<lang>\S+)\n)?\s?(?<code>[^]+?)\s?```/;
export const INVITE_REGEX =
	/(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|(?:app)?\.com\/invite)\/(\S+)/;
export const TOKEN_REGEX = /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/;
export const CODE_REGEX = /`(?<code>.+?)`/;

export const CHANNEL_REGEX = /^<#\d{17,19}>$/;
export const ROLE_REGEX = /^<@&\d{17,19}>$/;
export const USER_REGEX = /^<@!?\d{17,19}>$/;

export const ID_REGEX = /^\d{17,19}$/;
