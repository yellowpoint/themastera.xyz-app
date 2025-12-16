'use client'

import { CheckoutButton } from '@/components/stripe/CheckoutButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ShopPage() {
  return (
    <div className="container py-10 mx-auto">
      <h1 className="text-4xl font-bold mb-8">Shop</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>Great for growing teams</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              $20.00{' '}
              <span className="text-sm font-normal text-muted-foreground">
                / month
              </span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Up to 100 users</li>
              <li>• Up to 10,000 records</li>
              <li>• Priority support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <CheckoutButton
              priceId="price_1RWCOdQQcFkpjZ3XOHCTnq9j"
              mode="subscription"
              className="w-full"
            />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Product</CardTitle>
            <CardDescription>
              A simple product to test Stripe integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$10.00</p>
          </CardContent>
          <CardFooter>
            <CheckoutButton className="w-full" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
