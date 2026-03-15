import Layout from '../components/Layout'
import HeroSection from '../components/HeroSection'
import HeroCarousel from '../components/HeroCarousel'
import FeaturedProducts from '../components/FeaturedProducts'
import Features from '../components/Features'
import ManufacturingCapabilities from '../components/ManufacturingCapabilities'
import Testimonials from '../components/Testimonials'
import BrandLogos from '../components/BrandLogos'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <HeroCarousel />
      <FeaturedProducts />
      <Features />
      <ManufacturingCapabilities />
      <Testimonials />
      <BrandLogos />
    </Layout>
  )
}

export async function getStaticProps({ locale = 'en' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
