'use server'
import configPromise from '@payload-config'
import { handleServerFunctions as _handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from '../importMap.js'
import type { ServerFunctionArgs } from 'payload'

export const serverFunction = async (args: ServerFunctionArgs) => {
  return _handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}
