import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from '../importMap.js'
import { serverFunction } from './serverFunction'
import config from '@payload-config'
import React from 'react'
import '../../custom.css'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  return RootLayout({ children, config, importMap, serverFunction })
}
