import { Inhibitor } from "../typings/interfaces";

export const isGuildOwner: Inhibitor = ({ guild, member }) => {
	return guild.ownerId === member.user.id;
};
