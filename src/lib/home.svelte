<script>
	import { Links } from '../constants';
</script>

<section class="page-section" id="services">
	<div class="container">
		<div class="row">
			<div class="col-lg-12 text-center">
				<h3 class="section-heading text-uppercase">Links</h3>
			</div>
		</div>
		{#each Links as link (link.url)}
			<div class="row m-3">
				<div class="col-lg-12 text-center">
					<a class="btn btn-xl btn-secondary text-uppercase" href={link.url} target="_blank">
						{link.title}
					</a>
				</div>
			</div>
		{/each}
		<div class="row text-center" />
	</div>
</section>
