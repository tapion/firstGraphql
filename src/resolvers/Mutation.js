const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function post(parent, args, context) {
  const { userId } = context;
  const newLink = await context.prisma.link.create({
    data: {
      description: args.description,
      url: args.url,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubSub.publish("NEW_LINK", newLink);
  return newLink;
  //   const id = links.length;
  //   const link = {
  //     id: `link-${id}`,
  //     description:
  //     url: ,
  //   };
  //   links.push(link);
  //   return newLink;
}

function updateLink(parent, args) {
  const linkIndex = links.findIndex((link) => link.id === args.id);
  if (linkIndex >= 0) {
    console.log("lo encontro");
    links[linkIndex] = {
      ...links[linkIndex],
      description: args.description,
      url: args.url,
    };
    return links[linkIndex];
  }
}

function deleteLink(parent, args) {
  const linkIndex = links.findIndex((link) => link.id === args.id);
  if (linkIndex >= 0) {
    const link = links[linkIndex];
    links = links.filter((link) => link.id !== args.id);
    return link;
  }
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  console.log("arguments", args);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const user = context.prisma.user.findUnique({ where: { email: args.email } });
  if (!user) {
    throw new Error("No such user found");
  }
  const valid = bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("User or password not valid");
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function vote(parent, args, context, info) {
  const { userId } = context;
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });
  if (Boolean(vote)) {
    throw new Error("This vote was already sent");
  }
  const newVote = await context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });
  context.pubSub.publish('NEW_VOTE', newVote);
  return newVote;
}

module.exports = {
  post,
  updateLink,
  deleteLink,
  login,
  signup,
  vote,
};
