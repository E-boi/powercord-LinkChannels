const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule, React } = require('powercord/webpack');
const { Tooltip, Icon } = require('powercord/components');
const { clipboard } = require('electron');

module.exports = class LinkChannels extends Plugin {
	startPlugin() {
		this.loadStylesheet('style.css');
		const ChannelItem = getModule(m => m.default && m.default.displayName == 'ChannelItem', false);
		inject('linkbutton', ChannelItem, 'default', ([{ channel }], props) => {
			const children = props.props.children.props.children[1].props.children[1].props.children;
			children.unshift(
				React.createElement(LinkIcon, {
					onClick: () => {
						clipboard.writeText(`<#${channel.id}>`);
						powercord.api.notices.sendToast('linkchannel', {
							header: 'Copied Success!',
							timeout: 5000,
							content: `Copied mention for #${channel.name}!`,
						});
					},
				})
			);
			return props;
		});
		ChannelItem.default.displayName = 'ChannelItem';
	}

	pluginWillUnload() {
		uninject('linkbutton');
	}
};

class LinkIcon extends React.Component {
	render() {
		const classes = getModule(['iconItem'], false);
		return React.createElement(
			Tooltip,
			{
				className: classes.iconItem,
				text: 'Copy Channel',
				position: 'top',
				color: 'black',
			},
			React.createElement(
				'div',
				{
					className: 'linkChannels',
				},
				React.createElement('svg', {
					className: classes.actionIcon,
					viewBox: '0 0 20 20',
					onClick: this.props.onClick,
					children: React.createElement(Icon, { height: '20', name: 'Link' }),
				})
			)
		);
	}
}
