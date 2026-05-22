import axios from "axios";
import { Client, GatewayIntentBits } from "discord.js";
import { env } from "../config/env";

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

export const initDiscordBot = async () => {
  if (!env.DISCORD_BOT_TOKEN || env.DISCORD_BOT_TOKEN === "dummy") {
    console.warn("Discord bot token is not configured. Skipping Discord bot initialization.");
    return;
  }
  if (!discordClient.isReady()) {
    try {
      await discordClient.login(env.DISCORD_BOT_TOKEN);
    } catch (error) {
      console.error("Failed to login to Discord bot:", error);
    }
  }
};

export const exchangeDiscordCode = async (code: string) => {
  const params = new URLSearchParams();
  params.append("client_id", env.DISCORD_CLIENT_ID);
  params.append("client_secret", env.DISCORD_CLIENT_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", env.DISCORD_REDIRECT_URI);

  const { data } = await axios.post("https://discord.com/api/oauth2/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  return data as { access_token: string };
};

export const fetchDiscordUser = async (token: string) => {
  const { data } = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data as { id: string; username: string; avatar?: string };
};

export const addMemberRole = async ({ userId, role }: { userId: string; role: "student" | "professional" | "startup" }) => {
  await initDiscordBot();
  const guild = await discordClient.guilds.fetch(env.DISCORD_GUILD_ID);
  const member = await guild.members.fetch(userId);
  const roleId =
    role === "student"
      ? env.DISCORD_MEMBER_ROLE_STUDENT
      : role === "professional"
        ? env.DISCORD_MEMBER_ROLE_PRO
        : env.DISCORD_MEMBER_ROLE_STARTUP;
  await member.roles.add(roleId);
};

export const sendWelcomeMessage = async (userId: string, teamId?: string) => {
  await initDiscordBot();
  const user = await discordClient.users.fetch(userId);
  await user.send(`Welcome to IncuXai! Your team ID is ${teamId ?? ""}. Check #announcements for updates.`);
};

export const fetchDiscordAnnouncements = async () => {
  await initDiscordBot();
  const channel = await discordClient.channels.fetch(env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID);
  if (!channel || !channel.isTextBased()) {
    return [];
  }
  const messages = await channel.messages.fetch({ limit: 10 });
  return Array.from(messages.values()).map((message) => ({
    id: message.id,
    content: message.content,
    author: message.author.username,
    timestamp: message.createdAt
  }));
};

export const postAnnouncementToDiscord = async (title: string, content: string) => {
  await initDiscordBot();
  const channel = await discordClient.channels.fetch(env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID);
  if (!channel || !channel.isTextBased()) {
    return;
  }
  await (channel as any).send(`**${title}**\n${content}`);
};
