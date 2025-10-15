const { StatusCodes } = require("http-status-codes");
const { hotelTax } = require("../helpers/data");
const Trip = require("../models/Trip");
const Order = require("../models/Order");
const Stripe = require("stripe");


const createStripeSession = async (req, res) => {
    try {

        // 1. Initialiser le client Stripe avec la clé privée
        const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

        // 2. Récupérer les données envoyées par le client (front)
        const order = req.body.order;
        const token = req.body.token;
        const items = req.body.items; // items est un tableau d'un seul élément : items[0] = le trip 
        if (!items?.length) {
            return res.status(HTTP.BAD_REQUEST).json({ error: "No items provided" });
        }

        // 3. Retrouver en BDD le trip réellement vendu (source de vérité pour le prix)
        const foundTrip = await Trip.findById(items[0].id);
        if (!foundTrip) {
            return res.status(HTTP.NOT_FOUND).json({ error: "Trip not found" });
        }

        // 4) Créer la Checkout Session Stripe
        //    → Stripe va afficher une page sécurisée
        //    → Puis rediriger automatiquement vers success_url (si payé) ou cancel_url (si annulé)
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: items.map((item) => { // Définir les articles à payer.  Ici, on a qu'un seul trip
                return {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: foundTrip.title,
                        },
                        unit_amount: foundTrip.adultPrice * items[0].adults + foundTrip.youngPrice * items[0].kids + hotelTax,
                    },
                    quantity: item.quantity,
                };
            }),

            // URLs de redirection après paiement (succès / annulation)
            success_url:
                process.env.NODE_ENV === "production"
                    ? `${process.env.CLIENT_URL_PROD}/checkout-success`
                    : `${process.env.CLIENT_URL_LOCAL}/checkout-success`,
            success_url:
                process.env.NODE_ENV === "production" ? `${process.env.CLIENT_URL_PROD}/checkout` : `${process.env.CLIENT_URL_LOCAL}/checkout`,
        });


        // ⚠️ Note importante : idéalement, on n'enregistre PAS définitivement l'ordre d'achat ici.
        // La bonne pratique Stripe est d'attendre la preuve officielle du paiement via le WEBHOOK.
        // Doc : https://docs.stripe.com/checkout/fulfillment#create-event-handler


        // 5) Créer l'ordre d'achat dans la BDD
        //    - Sans token → visiteur (mettre email = "guest")
        //    - Avec token → utilisateur connecté
        if (!token.token) {
            await Order.create({ ...order, email: "guest@guest.com" });
        } else {
            await Order.create(order);
        }

        // 6. Répondre au front avec l'URL Stripe → le front redirige l'utilisateur vers cette page pour payer.
        return res.status(StatusCodes.OK).json({ url: session.url });

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

module.exports = { createStripeSession };
