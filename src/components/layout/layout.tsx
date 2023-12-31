import {FC} from 'react'

import {
	PanelHeader,
	Platform,
	SplitCol,
	SplitLayout,
	usePlatform,
	ModalRoot,
	Epic,
	View,
	useAdaptivityConditionalRender,
} from '@vkontakte/vkui'

import {Components, Home, Info, Persik} from '@/pages'
import {TestModalCard} from '@/popouts'

import {LayoutNav} from './nav'
import {LayoutSidebar} from './sidebar'
import {LayoutTabbar} from './tabbar'

import './layout.css'
import {useModalStore, usePopoutStore, useSnackbarStore} from '@/store'
import {useActiveVkuiLocation} from '@vkontakte/vk-mini-apps-router'
import {URL} from '@/router'

export const Layout: FC = () => {
	const platform = usePlatform()
	const popout = usePopoutStore.use.popout()
	const snackbar = useSnackbarStore.use.snackbar()
	const modal = useModalStore.use.modal()

	/** Получаем текущую позицию */
	const {panelsHistory, view: activeView, panel: activePanel} = useActiveVkuiLocation()
	const {viewWidth} = useAdaptivityConditionalRender()
	// Отрисовка всей навигации производится в роутере через передачу Id в  поля по типу activeModal
	// Если я не хочу иметь какую-то конкретную ссылку на popout или modal. Я могу глобально передавать id в корневой компонент
	return (
		<SplitLayout
			header={platform !== Platform.VKCOM && <PanelHeader separator={false} />}
			modal={
				<ModalRoot activeModal={modal}>
					<TestModalCard id="TestModalCard" />
				</ModalRoot>
			}
			popout={popout}
			aria-live="polite"
			aria-busy={!!popout}
		>
			<SplitCol
				autoSpaced
				width={650}
				maxWidth={650}
			>
				<Epic
					activeStory={activeView || URL.homeView}
					tabbar={
						platform !== Platform.VKCOM && (
							<LayoutTabbar>
								<LayoutNav mode="tabbarItem" />
							</LayoutTabbar>
						)
					}
				>
					<View
						activePanel={activePanel || URL.homePanel}
						nav={URL.homeView}
						history={panelsHistory}
					>
						<Home nav={URL.homePanel} />
						<Persik nav={URL.persikPanel} />
						<Components nav={URL.componentsPanel} />
					</View>

					<View
						nav={URL.infoView}
						activePanel={activePanel || URL.infoPanel}
					>
						<Info nav={URL.infoPanel} />
					</View>
				</Epic>
				{snackbar}
			</SplitCol>
			{platform === Platform.VKCOM && (
				<LayoutSidebar>
					<LayoutNav mode="cell" />
				</LayoutSidebar>
			)}
		</SplitLayout>
	)
}
