import dotenv from 'dotenv'
dotenv.config({ path: `.env` })
import { AppFacade } from './app/AppFacade'
import { MULTITON_KEY } from './app/constants/AppConstants'

// Instantiate the application facade and call its startup method
AppFacade.getInstance(MULTITON_KEY).startup()
