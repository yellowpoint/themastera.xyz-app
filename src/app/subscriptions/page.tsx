import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { SUBSCRIPTION_LEVELS } from '@/config/subscriptions'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'
import { ManageSubscriptionButton } from '@/components/stripe/ManageSubscriptionButton'
import { redirect } from 'next/navigation'

export default async function SubscriptionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  
  if (!session?.user) {
      redirect('/auth/login?callbackUrl=/subscriptions')
  }

  const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          stripeSubscriptionId: true,
      }
  })

  const isPro = user?.stripePriceId === SUBSCRIPTION_LEVELS.PRO.priceId && 
                user?.stripeCurrentPeriodEnd && 
                user.stripeCurrentPeriodEnd > new Date();
                
  const isMax = user?.stripePriceId === SUBSCRIPTION_LEVELS.MAX.priceId && 
                user?.stripeCurrentPeriodEnd && 
                user.stripeCurrentPeriodEnd > new Date();

  const isSubscribed = isPro || isMax;

  return (
     <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Choose Your Plan</h1>
            <p className="text-muted-foreground mt-2">Unlock premium features and exclusive content</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className={!isSubscribed ? "border-primary" : ""}>
                <CardHeader>
                    <CardTitle>{SUBSCRIPTION_LEVELS.FREE.name}</CardTitle>
                    <CardDescription>Perfect for getting started</CardDescription>
                    <div className="text-3xl font-bold mt-4">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {SUBSCRIPTION_LEVELS.FREE.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" variant="outline" disabled>
                        {!isSubscribed ? "Current Plan" : "Free Forever"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className={isPro ? "border-primary ring-2 ring-primary ring-offset-2" : ""}>
                 <CardHeader>
                    <CardTitle>{SUBSCRIPTION_LEVELS.PRO.name}</CardTitle>
                    <CardDescription>For serious creators</CardDescription>
                    <div className="text-3xl font-bold mt-4">
                        ${SUBSCRIPTION_LEVELS.PRO.price / 100}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {SUBSCRIPTION_LEVELS.PRO.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    {isPro ? (
                        <ManageSubscriptionButton className="w-full" label="Current Plan (Manage)" />
                    ) : isSubscribed ? (
                         <ManageSubscriptionButton className="w-full" label="Switch Plan" />
                    ) : (
                        <CheckoutButton 
                            priceId={SUBSCRIPTION_LEVELS.PRO.priceId} 
                            mode="subscription"
                            label="Upgrade to Pro"
                            className="w-full"
                        />
                    )}
                </CardFooter>
            </Card>

            {/* Max Plan */}
            <Card className={isMax ? "border-primary ring-2 ring-primary ring-offset-2" : ""}>
                 <CardHeader>
                    <CardTitle>{SUBSCRIPTION_LEVELS.MAX.name}</CardTitle>
                    <CardDescription>The ultimate experience</CardDescription>
                    <div className="text-3xl font-bold mt-4">
                        ${SUBSCRIPTION_LEVELS.MAX.price / 100}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {SUBSCRIPTION_LEVELS.MAX.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    {isMax ? (
                        <ManageSubscriptionButton className="w-full" label="Current Plan (Manage)" />
                    ) : isSubscribed ? (
                         <ManageSubscriptionButton className="w-full" label="Switch Plan" />
                    ) : (
                        <CheckoutButton 
                            priceId={SUBSCRIPTION_LEVELS.MAX.priceId} 
                            mode="subscription"
                            label="Upgrade to Max"
                            className="w-full"
                        />
                    )}
                </CardFooter>
            </Card>
        </div>
     </div>
  )
}
