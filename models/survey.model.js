const Mysql                 = require('mysql');
const Model 				= require('./model');
const Constants 			= require('../config/constants');

class SurveyModel extends Model {
	constructor() {
		super();
		this.captcha = this.generateCaptcha();
	}

	async getSurvey() {
		let response_data 	    = {status: false, result: [], err: null};
		
		try{
			let get_survey_query 		= Mysql.format(`
				SELECT surveys.id, surveys.name, surveys.location, surveys.favorite_language, surveys.comment
				FROM surveys
				ORDER BY surveys.id DESC
				LIMIT 1;`
			);

			let [get_survey_result] = await this.executeQuery(get_survey_query);
	
			if(get_survey_result){
				response_data.status 	= true;
				response_data.result 	= get_survey_result;
			}else{
				response_data.message 	= "No survey found";
			}
		}catch(err){
			response_data.err 			= err;
			response_data.message 		= "Error in getting a survey.";
		};
	
		return response_data;		
	}

	async createSurvey(name, dojo_location, fave_lang, comment){
		let insert_survey_query = Mysql.format(`
				INSERT INTO surveys(surveys.name, surveys.location, surveys.favorite_language, surveys.comment)
				VALUES ('${name}', '${dojo_location}',
				'${fave_lang}', '${comment}');`
			);
		await this.executeQuery(insert_survey_query);
	}

	// supply the logic for each function:
	generateCaptcha(){
		let generated_captcha = '';
		var characters        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var characters_length = characters.length;
		
		for( var i = 0; i < 6; i++ ) {
			generated_captcha += characters.charAt(Math.floor(Math.random() * characters_length));
		}

		return generated_captcha; 
	}

	verifyCaptchaInput(input){
		if(this.captcha == input){
			return "Success! Captcha input matched.";
		}else{
			return "Error! Captcha input doesn't matched.";
		}
	}
}

module.exports = SurveyModel;