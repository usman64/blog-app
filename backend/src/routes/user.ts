import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from "hono/jwt";
import { signupInput, signinInput } from "@usmantariq/medium-blog-common";

const userRoutes = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

userRoutes.post('/signup', async (c) => {
    // All routes maybe independently deployed. Hence, we need to 
    // define prisma and can only access env variable here in a route from context c
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body)

    if (!success) {
        c.status(411)
        return c.json({error: "Inputs not correct"})
    }

    try {
        const user = await prisma.user.create({
          data: {
            email: body.email,
            password: body.password,
            name: body.name,
          },
        });
      
        const token = await sign({id: user.id }, c.env.JWT_SECRET)
      
        return c.json({
          jwt: token
        });
    } catch (e) {
        c.status(411)
        return c.json({ error: "Unable to Signup!"})
    }
})

userRoutes.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = signinInput.safeParse(body)

    if (!success) {
        c.status(411)
        return c.json({error: "Inputs not correct"})
    }

    const user = await prisma.user.findUnique({
        where: {
        email: body.email
        }
    })

    if (!user) {
        c.status(403)
        return c.json({ error: "user not found"})
    }

    const jwt = await sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({ jwt })
})

export default userRoutes;