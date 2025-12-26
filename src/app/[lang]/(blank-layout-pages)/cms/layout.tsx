// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import Providers from '@components/Providers'
import CmsLayout from '@/modules/Cms/frontend/components/CmsLayout'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType & {
  params: Promise<{ lang: Locale }>
}

const CmsLayoutWrapper = async (props: Props) => {
  const params = await props.params
  const { children } = props

  // Vars
  const direction = i18n.langDirection[params.lang]
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <CmsLayout mode={systemMode}>{children}</CmsLayout>
    </Providers>
  )
}

export default CmsLayoutWrapper
