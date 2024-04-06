import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@usmantariq/medium-blog-common";

const blogRoutes = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables : {
        userId: string;
    }
}>();


blogRoutes.use('/*', async (c, next) => {
    const header = await c.req.header("authorization") || "";
      const token = header?.split(" ")[1]; // [Bearer, token]
      const user = await verify(token, c.env.JWT_SECRET)
      if (user.id) {
        c.set("userId", user.id)
        await next()
      } else {
        c.status(403)
        return c.json({ error: "You are not logged in"})
      }
});

blogRoutes.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body)

    if (!success) {
        c.status(411)
        return c.json({error: "Inputs not correct"})
    }

    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        })
    
        return c.json({
            id: post.id
        })
    } catch (e) {
        c.status(411)
        return c.json({
            message: "Error while creating blog post"
        })
    }
})
  
blogRoutes.put('/:id', async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body)

    if (!success) {
        c.status(411)
        return c.json({error: "Inputs not correct"})
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const post = await prisma.post.update({
            where: {
                id,
            },
            data: {
                title: body.title,
                content: body.content,
            }
        })
    
        return c.json({
            id: post.id
        }) 
    } catch (e) {
        c.status(411)
        return c.json({
            message: "Error while updating blog post"
        })
    }
})
  
blogRoutes.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const post = await prisma.post.findFirst({
            where: {
               id,
            },
        })
    
        return c.json({
            post
        }) 
    } catch (e) {
        c.status(411)
        return c.json({
            message: "Error while fetching blog post"
        })
    }
})

export default blogRoutes;